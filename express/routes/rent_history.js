import express from 'express'
import multer from 'multer'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層

const router = express.Router()
const upload = multer()

// 依據order_id 取得所有訂單中的商品資訊
router.get('/item/:order_id', async (req, res) => {
  const orderId = req.params.order_id

  try {
    const [orderItems_rows] = await db.query(
      `
          SELECT 
          r_order.*,
          price.*,
          product.product_name, product.main_img 
          FROM 
          price_relate_order AS r_order 
          JOIN 
          product_price AS price ON r_order.price_id = price.price_id 
          JOIN 
          rent_product AS product ON price.product_id = product.product_id 
          WHERE 
          r_order.shop_order_id = ? 
          `,
      [orderId]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取購物車列表內容。',
      orderItems_rows,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單筆訂單中的商品資訊時，SQL查詢錯誤。',
    })
  }
})

// 依據訂單編號取得所有商品資訊以及評價資訊
router.get('/comment/:order_id', async (req, res) => {
  const orderId = req.params.order_id
  try {
    const [commentItems] = await db.query(
      `
          SELECT 
          r_order.*,
          price.*,
          product.product_name, product.main_img,
          comment.comment_id, comment.rating AS rating, comment.comment_content AS content, comment.created_at AS comment_create_time, comment.updated_at AS comment_update_time,comment.status,
          shop_order.start_time, shop_order.end_time
          FROM 
          p_shop_order AS shop_order 
          JOIN 
          price_relate_order AS r_order ON shop_order.order_id = r_order.shop_order_id 
          JOIN 
          product_price AS price ON r_order.price_id = price.price_id 
          JOIN 
          rent_product AS product ON price.product_id = product.product_id 
          LEFT JOIN 
          product_comment AS comment ON r_order.price_id = comment.price_id 
          AND comment.order_id = ?
          WHERE 
          r_order.shop_order_id = ?
          `,
      [orderId, orderId]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取單一訂單中的商品內容以及對應的評價資訊。',
      commentItems,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：獲取單一訂單中的商品內容以及對應的評價資訊時，SQL查詢錯誤。',
    })
  }
})

router.post('/comment', async (req, res) => {
  try {
    const { order_id, product_id, price_id, user_id, rating, content } =
      req.body

    await db.query(
      `
      INSERT INTO product_comment (
      product_id,
      price_id,
      order_id,
      user_id,
      rating,
      comment_content,
      status,
      create_datetime,
      created_at,
      updated_at
      ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      0,
      NOW(),
      NOW(),
      NOW()
      )
      `,
      [product_id, price_id, order_id, user_id, rating, content]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功：新增評價成功。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：新增商品評價時，SQL錯誤。',
    })
  }
})

// 修改評論 限定只能修改一次
router.put('/comment', async (req, res) => {
  try {
    const { comment_id, rating, content } = req.query

    await db.query(
      `
      UPDATE product_comment 
      SET rating = ?, comment_content = ? ,updated_at = NOW(), status = status + 1
      WHERE comment_id = ? 
      `,
      [rating, content, comment_id]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功：更新評價成功。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：更新商品評價時，SQL錯誤。',
    })
  }
})

// 獲取用戶的所有訂單資料
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id
  try {
    const [history_rows] = await db.query(
      `
          SELECT 
          shop_order.*
          FROM 
          p_shop_order AS shop_order
          WHERE 
          shop_order.user_id = ? 
          ORDER BY 
          shop_order.create_datetime DESC 
          `,
      [userId]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取購物車列表內容。',
      history_rows,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢用戶訂單時，SQL查詢錯誤。',
    })
  }
})

export default router
