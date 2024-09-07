import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Group_event, Group_Organizer, Campground_Info, Room, Room_Img } =
  sequelize.models

// --------------------------------------------------------

// GET - 得到所有團露活動資料
router.get('/', async function (req, res) {
  const events = await Group_event.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  // return res.json({ status: 'success', data: { events } })
  return res.json(events)
})

// --------------------------------------------------------

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)
  const event = await Group_event.findByPk(id, {
    // findByPk以主鍵查詢
    raw: true, // 只需要資料表中資料
  })
  // return res.json({ status: 'success', data: { event } })
  return res.json([event])
})

// --------------------------------------------------------

export default router
