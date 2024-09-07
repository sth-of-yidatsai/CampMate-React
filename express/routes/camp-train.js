import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/', async function (req, res) {
  // 轉為數字
  const [rows] = await db.query('SELECT * FROM campground_train')
  const train_station = rows

  return res.json({ status: 'success', data: { train_station } })
})

router.get('/:city', async function (req, res) {
  const city = req.params.city
  // 轉為數字
  try {
    // 查詢資料庫
    const [rows] = await db.query(
      'SELECT * FROM campground_train WHERE city = ?',
      [city]
    )
    const train_station = rows

    return res.json({ status: 'success', data: { train_station } })
  } catch (error) {
    console.error('Error querying the database:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

export default router
