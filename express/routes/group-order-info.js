import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { C_Order, Campground_Info, Room, Room_Img } = sequelize.models

// Express.js 伺服器端
router.get('/api/member-orders/:user_id', async (req, res) => {
  const { user_id } = req.params

  try {
    // 從 C_Order 表中查詢會員的訂單
    const orders = await C_Order.findAll({
      where: { user_id }, // 根據會員 ID 查詢訂單
    })

    // 使用 Promise.all 同步查詢每一筆訂單的相關資料
    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const room = await Room.findOne({
          where: { id: order.room_id }, // 假設 order 中有 room_id 欄位
        })

        const campground = await Campground_Info.findOne({
          where: { id: room.campground_id }, // 假設 room 中有 campground_id 欄位
        })

        const images = await Room_Img.findAll({
          where: { room_id: room.id }, // 根據 roomId 查詢圖片
        })

        return {
          orderNum: order.order_number,
          startDate: order.check_in_date,
          endDate: order.check_out_date,

          // maxMember: order.room_people, // 假設有 maxMember 欄位
          room: {
            id: room.id,
            name: room.room_name, // 假設有 name 欄位
            campground: {
              id: campground.id,
              name: campground.campground_name, // 假設有 name 欄位
              address: campground.address, // 假設有 address 欄位
              city: campground.city, // 假設有 city 欄位
              phone: campground.phone,
              groundIntro: campground.campground_introduction,
              altitude: campground.altitude,
              geolocation: campground.geolocation,
            },
            images: images.map((img) => ({
              id: img.id,
              url: img.path, // 假設有 url 欄位
            })),
          },
        }
      })
    )

    // 返回整合後的資料
    res.json({ data: orderDetails })
  } catch (error) {
    console.error('Failed to fetch data:', error)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
})

export default router
