// server.js
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const mysql = require('mysql2') // 使用 mysql2

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

// 資料庫連接設置
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '12345', // 請設定你的資料庫密碼
  database: 'campmate_db', // 請替換成你的資料庫名稱
})

db.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL database')
})

// 設定 socket.io
io.on('connection', (socket) => {
  console.log('A user connected')

  // 接收訊息並存儲到資料庫
  socket.on('message', (message) => {
    const query =
      'INSERT INTO chat_box (text, sender, user, time, date) VALUES (?, ?, ?, ?, ?)'
    db.query(
      query,
      [message.text, message.sender, message.user, message.time, message.date],
      (err, result) => {
        if (err) throw err
        console.log('Message saved to database')
      }
    )

    // 廣播訊息
    io.emit('message', message)
  })

  // 當用戶斷開連接時
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// 啟動伺服器
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
