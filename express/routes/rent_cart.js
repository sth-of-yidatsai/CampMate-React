import express from 'express'
import multer from 'multer'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層

const router = express.Router()
const upload = multer()

router.get('/', async (req, res) => {
  try {
    const [cart_rows] = await db.query(`
      SELECT
      cart.*, 
      p_r_o.count,
      price.product_price AS price ,price.style_name AS style, price.size_name AS size, price.price_id,
      product.product_name, product.main_img
      FROM
      p_shop_cart AS cart
      JOIN
      price_relate_order AS p_r_o ON cart.shop_cart_id = p_r_o.shop_cart_id
      JOIN
      product_price AS price ON p_r_o.price_id = price.price_id
      JOIN 
      rent_product AS product ON price.product_id = product.product_id 
      `)

    // const [cart_items] = await db.query(`
    //     SELECT
    //     p_r_o.*
    //     FROM
    //     price_relate_order AS p_r_o
    //     `)

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取購物車列表內容。',
      cart_rows,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單一商品時，SQL查詢錯誤。',
    })
  }
})

router.get('/pickup/:user_id', async (req, res) => {
  const id = req.params.user_id
  try {
    const [pickup_rows] = await db.query(`
      SELECT
      *
      FROM 
      pickup_info
      WHERE 
      user_id = ${id} 
      ORDER BY 
      default_num DESC, pickup_id DESC
      `)

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取以儲存的取件人預設。',
      data: {
        pickup_rows,
      },
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢已儲存取件人資訊時，SQL查詢錯誤。',
    })
  }
})

router.get('/price_id=:id', async (req, res) => {
  const id = req.params.id
  try {
    const [price_rows] = await db.query(`
      SELECT
      product.product_name, product.main_img,
      price.* 
      FROM 
      rent_product AS product 
      JOIN 
      product_price AS price ON product.product_id = price.product_id 
      WHERE 
      price.price_id = ${id}
      `)

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取商品相關的顏色尺寸價格。',
      price_rows,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單一商品的product_price時，SQL查詢錯誤。',
    })
  }
})

// GET - 取得單一用戶的所有優惠券（根據用戶 ID）
router.get('/user_coupon/:user_id', async function (req, res) {
  try {
    const userId = parseInt(req.params.user_id, 10)

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user ID' })
    }

    let query = `
      SELECT uc.id AS user_coupon_id ,uc.*, c.* FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.user_id = ?
    `
    const params = [userId]

    // 根據 received_at 降冪排序
    query += ' ORDER BY uc.received_at DESC'

    const [userCoupons] = await db.query(query, params)

    if (userCoupons.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No coupons found for this user' })
    }

    return res.json({ status: 'success', data: { userCoupons } })
  } catch (error) {
    console.error('Error fetching user coupons:', error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// PATCH - 更新用戶的優惠券狀態
router.put('/update_user_coupon/:user_id', async function (req, res) {
  try {
    const userId = req.params.user_id
    const { status, order_id, user_coupon_id } = req.body // 新狀態應從前端提供
    console.log(status, order_id, user_coupon_id, userId)
    // if (isNaN(couponId) || isNaN(userId) || !status) {
    //   return res.status(400).json({ status: 'error', message: 'Invalid input' })
    // }

    const query = `
      UPDATE user_coupon 
      SET status = ? , p_order_id = ?
      WHERE id = ? AND user_id = ?
    `

    const [result] = await db.query(query, [
      status,
      order_id,
      user_coupon_id,
      userId,
    ])

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Coupon not found for user' })
    }

    return res.json({
      status: 'success',
      message: 'Coupon status updated successfully',
    })
  } catch (error) {
    console.error('Error updating coupon status:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      detail: error.message,
    })
  }
})

router.put('/coupon/:user_coupon_id/order/:order_id', async (req, res) => {
  const userCouponId = res.params.user_coupon_id
  const orderId = res.params.order_id

  try {
    await db.query(
      `
      UPDATE 
      user_coupon 
      SET 
      status = ? , p_order_id = ? 
      WHERE 
      id = ?
      `,
      ['已使用', userCouponId, orderId]
    )
  } catch (err) {
    console.log(err)
  }
})

export default router
