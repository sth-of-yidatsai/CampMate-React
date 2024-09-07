import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Group_Organizer } = sequelize.models

// --------------------------------------------------------

// GET - 得到所有團露活動資料
router.get('/', async function (req, res) {
  const organizers = await Group_Organizer.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json(organizers)
})

// --------------------------------------------------------

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const organizer = await Group_Organizer.findByPk(id, {
    // findByPk以主鍵查詢
    raw: true, // 只需要資料表中資料
  })

  // return res.json({ status: 'success', data: { organizer } })
  return res.json(organizer)
})

// --------------------------------------------------------

// GET - 根據user_id取該user的所有報名資料
router.get('/user/:user_id', async function (req, res) {
  const user_id = Number(req.params.user_id)

  const organizers = await Group_Organizer.findAll({
    where: { user_id },
    raw: true, // 只需要資料表中資料
  })

  return res.json(organizers)
})

// --------------------------------------------------------

export default router
