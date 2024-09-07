import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

import authenticate from '##/middlewares/authenticate.js'

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:order_number', authenticate, async function (req, res) {
  const user_id = req.user.id
  const order_number = req.params.order_number
  try {
    const [rows] = await db.query(
      `SELECT * FROM review WHERE user_id = ? AND c_order_id = ?`,
      [user_id, order_number]
    )
    const review = rows[0]

    if (rows.length === 0) {
      return res.json({ status: 'fail', message: 'No data found' })
    }

    return res.json({ status: 'success', data: { review } })
  } catch (error) {
    console.error('Database query failed:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

router.post('/', authenticate, async function (req, res) {
  const user_id = req.user.id
  const { campground_id, order_number, rating, review_content } = req.body

  try {
    // 插入新的 review
    const [result] = await db.execute(
      `INSERT INTO review (campground_id, user_id, c_order_id, rating, review_content)
       VALUES ( ?, ?, ?, ?, ?)`,
      [campground_id, user_id, order_number, rating, review_content]
    )

    // 檢查插入操作是否成功
    if (result.affectedRows > 0) {
      // 獲取剛剛插入的 review 記錄
      const [rows] = await db.execute(
        `SELECT * FROM review
         WHERE user_id = ? AND c_order_id = ? AND campground_id = ?`,
        [user_id, order_number, campground_id]
      )

      // 假設唯一條件下的第一行就是剛插入的記錄
      const newReview = rows[0]

      return res
        .status(201) // HTTP 201 Created 表示資源成功創建
        .json({
          status: 'success',
          message: 'Review created successfully',
          data: { review: newReview },
        })
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to create review',
      })
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

router.put('/:order_number', authenticate, async function (req, res) {
  const user_id = req.user.id
  const order_number = req.params.order_number
  const { rating, review_content } = req.body

  try {
    const [result] = await db.execute(
      `UPDATE review
       SET rating = ?, review_content = ?
       WHERE user_id = ? AND c_order_id = ?`,
      [rating, review_content, user_id, order_number]
    )

    // 檢查受影響的行數，以確保更新實際發生
    if (result.affectedRows > 0) {
      // 獲取剛剛插入的 review 記錄
      const [rows] = await db.execute(
        `SELECT * FROM review
         WHERE user_id = ? AND c_order_id = ?`,
        [user_id, order_number]
      )

      // 假設唯一條件下的第一行就是剛插入的記錄
      const newReview = rows[0]

      return res
        .status(200) // HTTP 201 Created 表示資源成功創建
        .json({
          status: 'success',
          message: 'Review updated successfully',
          data: { review: newReview },
        })
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found or no changes made',
      })
    }
  } catch (error) {
    console.error('Error updating review:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

export default router
