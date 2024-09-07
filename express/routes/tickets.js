import express, { query } from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const { Ticket } = sequelize.models

import db from '#configs/mysql.js'

// GET - 取得所有客服單資料
// router.get('/', async function (req, res) {
//   try {
//     const tickets = await Ticket.findAll({ logging: console.log })
//     // 處理如果沒找到資料
//     if (!tickets.length) {
//       return res
//         .status(404)
//         .json({ status: 'error', message: 'No tickets found' })
//     }
//     // 標準回傳JSON
//     return res.json({ status: 'success', data: { tickets } })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ status: 'error', message: 'Server error' })
//   }
// })

// GET - 根據 user_id 獲取所有相關資料
router.get('/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)

    // 確保 user_id 是有效的數字
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user_id' })
    }

    // 查詢所有與 user_id 相關的客服單
    const tickets = await Ticket.findAll({
      where: { user_id: userId },
      raw: true, // 只需要資料表中資料
    })

    // 如果沒有找到資料，返回 404
    if (tickets.length === 0) {
      return res.status(404).json({ status: 'error', message: '尚無客服單' })
    }

    // 回傳所有相關資料
    return res.json({ status: 'success', data: { tickets } })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// POST - 新增客服單資料
router.post('/', async (req, res) => {
  try {
    const { user_id, email, phone, order_id, category, description, status } =
      req.body

    if (!user_id || !email || !phone || !category || !description) {
      return res.status(400).json({ success: false, error: '缺少必要欄位' })
    }

    const newTicket = await Ticket.create({
      user_id,
      email,
      phone,
      order_id,
      category,
      description,
      status,
    })

    res.status(201).json({ success: true, data: newTicket })
  } catch (error) {
    console.error('Error creating ticket:', error) // 打印錯誤
    res
      .status(500)
      .json({ success: false, error: error.message || '伺服器錯誤' })
  }
})

// 依照user_id和id去修改ticket
router.put('/:user_id/:id', async (req, res) => {
  try {
    const { user_id, id } = req.params
    const { email, phone, order_id, category, description } = req.body

    const query = `
      UPDATE 
      ticket 
      SET 
      email = ?, phone = ?, order_id = ?, category = ?, description = ? ,updated_at = NOW()
      WHERE 
      id = ? AND user_id = ?
      `

    const [result] = await db.query(query, [
      email,
      phone,
      order_id,
      category,
      description,
      id,
      user_id,
    ])

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: '修改發生錯誤，請稍後再試' })
    }

    return res.json({
      status: 'success',
      message: `更新成功，受影響的行數: ${result.affectedRows}`,
    })
  } catch (error) {
    console.error('Error updating ticket status:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      detail: error.message,
    })
  }
})

export default router
