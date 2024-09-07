import express from 'express'
const router = express.Router()

// 資料庫使用
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { C_tag } = sequelize.models

router.get('/', async function (req, res) {
  const tags = await C_tag.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { tags } })
})

export default router
