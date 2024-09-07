import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Group_Test } = sequelize.models

// GET - 得到所有團露活動資料
router.get('/', async function (req, res) {
  const tests = await Group_Test.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  // return res.json({ status: 'success', data: { events } })
  return res.json(tests)
})

// --------------------------------------------------------

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  // ---
  const test = await Group_Test.findByPk(id, {
    // findByPk以主鍵查詢
    raw: true, // 只需要資料表中資料
  })
  if (!test) {
    return res.status(404).json({ status: 'error', message: '未找到相關資料' })
  }
  // return res.json({ status: 'success', data: { event } })
  return res.json([test])
})

// -------------------------------
// POST - 新增一筆測試資料
router.post('/', async function (req, res) {
  console.log('接收到的資料:', req.body)
  try {
    const { name, email } = req.body

    const newTestData = await Group_Test.create({
      name: name,
      email: email,
    })

    return res
      .status(201)
      .json({ status: 'success', data: { test: newTestData } })
  } catch (error) {
    console.error('測試資料儲存失敗:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '測試資料儲存失敗，請稍後再試' })
  }
})
// -----------------
export default router
