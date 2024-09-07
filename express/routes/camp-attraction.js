import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/', async function (req, res) {
  // 轉為數字
  const [rows] = await db.query('SELECT * FROM campground_attraction')
  const attraction = rows

  return res.json({ status: 'success', data: { attraction } })
})

// 路由來處理 Distance Matrix API 請求
router.get('/distance', async (req, res) => {
  const { origins, destinations } = req.query
  const GOOGLE_MAPS_API_KEY = 'AIzaSyB_LOQQfhx4vW1PqIZZRSE6eVRcMW3XvDQ'

  if (!origins || !destinations) {
    return res
      .status(400)
      .json({ error: 'Origins and destinations parameters are required' })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAPS_API_KEY}`
    )

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching distance matrix:', error)
    res.status(500).json({ error: 'Failed to fetch distance matrix' })
  }
})

router.get('/:camp_id', async function (req, res) {
  const camp_id = req.params.camp_id
  // 轉為數字
  try {
    // 查詢資料庫
    const [rows] = await db.query(
      'SELECT * FROM campground_attraction WHERE campground_id = ?',
      [camp_id]
    )
    const attraction = rows

    return res.json({ status: 'success', data: { attraction } })
  } catch (error) {
    console.error('Error querying the database:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

export default router
