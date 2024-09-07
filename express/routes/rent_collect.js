import express from 'express'
import multer from 'multer'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層

const router = express.Router()
const upload = multer()

// 查詢收藏
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id

  console.log(userId)

  try {
    const query = `
      SELECT 
      * 
      FROM 
      collect_product 
      WHERE 
      user_id = ?
      `

    const [isCollect] = await db.query(query, [userId])

    console.log(isCollect)

    res.status(200).json({
      status: 'success',
      msg: '查詢是否收藏成功！',
      isCollect,
    })
  } catch (err) {
    console.log(`查詢用戶是否收藏失敗，錯誤訊息：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '查詢用戶是否收藏時失敗!!',
    })
  }
})

// 新增收藏
router.post('/:user_id', async (req, res) => {
  const userId = req.params.user_id
  const { product_id } = req.body

  try {
    const query = `
    INSERT INTO 
    collect_product (
    user_id,
    product_id,
    created_at,
    updated_at
    ) VALUES (
    ?,
    ?,
    NOW(),
    NOW()
    )
    `

    await db.query(query, [userId, product_id])

    res.status(200).json({
      status: 'success',
      msg: `新增商品${product_id}成功！`,
    })
  } catch (err) {
    console.log(`新增用戶收藏失敗，錯誤訊息：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '新增收藏時失敗!!',
    })
  }
})

// 刪除收藏
router.delete('/:user_id/product/:product_id', async (req, res) => {
  const userId = req.params.user_id
  const productId = req.params.product_id

  try {
    const query = `
    DELETE FROM 
    collect_product 
    WHERE 
    user_id = ? AND product_id = ? 
    `

    await db.query(query, [userId, productId])

    res.status(200).json({
      status: 'success',
      msg: `取消商品${productId}成功！`,
    })
  } catch (err) {
    console.log(`取消用戶收藏失敗，錯誤訊息：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '取消收藏時失敗!!',
    })
  }
})

export default router
