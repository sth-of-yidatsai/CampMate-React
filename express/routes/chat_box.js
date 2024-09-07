import express from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const { Chat_Box, User } = sequelize.models

Chat_Box.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
})
User.hasMany(Chat_Box, {
  foreignKey: 'user_id',
  sourceKey: 'id',
})

// GET - 取得所有聊天資料
router.get('/', async function (req, res) {
  try {
    const chats = await Chat_Box.findAll({
      include: [
        {
          model: User,
          attributes: ['name'], // 只選擇需要的字段
        },
      ],
    })

    // 處理如果沒找到資料
    if (!chats.length) {
      return res.status(404).json({ status: 'error', message: '沒有聊天紀錄' })
    }
    // 標準回傳JSON
    return res.json({ status: 'success', data: { chats } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 根據 user_id 獲取所有相關資料
router.get('/:user_id', async (req, res) => {
  try {
    // 轉為數字
    const userId = Number(req.params.user_id)

    // 確保 user_id 是有效的數字
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user_id' })
    }

    // 查詢所有與 user_id 相關的聊天記錄
    const chats = await Chat_Box.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['name'], // 只選擇需要的字段
        },
      ],
      raw: false, // 使用 Sequelize 的實例對象而不是原始資料
    })

    // 如果沒有找到資料，返回 404
    if (chats.length === 0) {
      return res.status(404).json({ message: '尚無聊天紀錄' })
    }

    // 回傳所有相關資料
    return res.json({ status: 'success', data: { chats } })
  } catch (error) {
    // 捕捉錯誤並返回 500
    console.error('Error fetching chats:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

// POST - 新增聊天紀錄
router.post('/', async (req, res) => {
  try {
    const { user_id, sender_id, text } = req.body

    if (
      !user_id ||
      !sender_id ||
      !text ||
      typeof text !== 'string' ||
      text.trim() === ''
    ) {
      return res.status(400).json({ status: 'error', message: '請輸入訊息' })
    }
    // 創建新聊天紀錄
    const newChat = await Chat_Box.create({
      user_id,
      sender_id,
      text: text.trim(),
    })

    return res.status(201).json({ status: 'success', data: newChat })
  } catch (error) {
    // 捕捉錯誤並返回 500
    console.error('Error sending message:', error)
    return res.status(500).json({ status: 'error', message: '訊息發送失敗' })
  }
})

export default router
