import express from 'express'
import multer from 'multer'

import { v4 as uuidv4 } from 'uuid'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層
import { DATE, NUMBER } from 'sequelize'

const router = express.Router()
const upload = multer()

// router.get('/', async (req, res) => {
//   try {
//     res.status(200).json({
//       status: 'success',
//       msg: '成功：獲取購物車列表內容。',
//     })
//   } catch (err) {
//     console.log(`SQL查詢錯誤：${err}`)
//     res.status(500).json({
//       status: 'error',
//       msg: '錯誤：查詢單一商品時，SQL查詢錯誤。',
//     })
//   }
// })

// 於結帳時將訂單資料寫入
router.post('/:user_id', async (req, res) => {
  const userId = req.params.user_id

  const order = JSON.parse(req.body.order)
  const orderItems = JSON.parse(req.body.orderItems)

  console.log(order)
  console.log(orderItems)

  try {
    await db.query(
      `
    INSERT INTO p_shop_order (
     order_id,
      user_id,
      shop_id,
      start_time,
      end_time,
      amount,
      create_datetime,
      payment,
      order_status,
      pickup_id,
      notes,
      status,
      order_info,
      created_at,
      updated_at
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      NOW(),
      NOW()
    )
    `,
      [
        order.order_id,
        order.user_id,
        order.shop_id,
        order.start_time,
        order.end_time,
        order.amount,
        order.create_datetime,
        order.payment,
        order.order_status,
        order.pickup_id,
        order.notes,
        order.status,
        order.order_info,
      ]
    )

    // 插入訂單項目到 order_items 表
    for (const item of orderItems) {
      await db.query(
        `
        INSERT INTO price_relate_order (
          shop_order_id,
          price_id,
          count,
          created_at,
          updated_at
        ) VALUES (
          ?, ?, ?, NOW(), NOW()
        )
        `,
        [order.order_id, item.price_id, item.count]
      )
    }

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取購物車列表內容。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單一商品時，SQL查詢錯誤。',
    })
  }
})

// 原本用來更新狀態使用的
router.put('/:order_id', async (req, res) => {
  const orderId = req.params.order_id
  const status = req.body.status
  console.log(status, orderId)
  try {
    await db.query(
      `
      UPDATE 
      p_shop_order 
      SET 
      order_status = ? ,updated_at = NOW()
      WHERE 
      order_id = ? 
      `,
      [status, orderId]
    )
    res.status(200).json({
      status: 'success',
      msg: '成功：更新單一訂單狀態。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：更新單一訂單狀態時，SQL錯誤。',
    })
  }
})

export default router
