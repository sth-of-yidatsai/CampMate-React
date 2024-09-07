import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 處理 POST 請求的邏輯
      const ticket = req.query
      // 假設你有一個處理 ticket 的函數
      // const result = await processTicket(ticket);
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error processing ticket:', error)
      res.status(500).json({ success: false, message: '建立客服單失敗' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export const register = async (ticket) => {
  try {
    const response = await axios.post('http://localhost:3005/tickets', ticket, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error.response ? error.response.data.error : '未知錯誤'
    throw new Error(errorMessage)
  }
}
