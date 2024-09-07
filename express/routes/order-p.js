import express from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const { P_Shop_Order } = sequelize.models

// GET - 取得所有客服單資料
router.get('/', async function (req, res) {
  try {
    const p_orders = await P_Shop_Order.findAll({ logging: console.log })
    // 處理如果沒找到資料
    if (!p_orders.length) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No tickets found' })
    }
    // 標準回傳JSON
    return res.json({ status: 'success', data: { p_orders } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 根據 user_id 獲取所有相關資料
router.get('/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)

    // 確保 user_id 是有效的數字
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user_id' })
    }

    // 查詢所有與 user_id 相關的客服單
    const p_orders = await P_Shop_Order.findAll({
      where: { user_id: userId },
      raw: true, // 只需要資料表中資料
    })

    // 如果沒有找到資料，返回 404
    if (p_orders.length === 0) {
      return res.status(404).json({ status: 'error', message: '尚無客服單' })
    }

    // 回傳所有相關資料
    return res.json({ status: 'success', data: { p_orders } })
  } catch (error) {
    console.error('Error fetching p_orders:', error)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
