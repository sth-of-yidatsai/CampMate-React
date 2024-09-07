const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const db = require('./db') // 引入資料庫模組

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('message', (message) => {
    // 儲存消息到資料庫
    const query =
      'INSERT INTO messages (text, sender, user, time, date) VALUES (?, ?, ?, ?, ?)'
    const values = [
      message.text,
      message.sender,
      message.user,
      message.time,
      message.date,
    ]

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error saving message:', err)
        return
      }
      console.log('Message saved to database:', results)
    })

    // 發送消息到所有連接的客戶端
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
