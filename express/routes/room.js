import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query(
    'SELECT room.*, room_img.* FROM room LEFT JOIN room_img ON room_img.room_id = room.id WHERE room.id = ?',
    [id]
  )
  const room = rows[0]

  return res.json({ status: 'success', data: { room } })
})

export default router
