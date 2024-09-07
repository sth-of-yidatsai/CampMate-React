import express from 'express'
const router = express.Router()

// 資料庫使用
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// 密碼編碼和檢查比對用
import { generateHash, compareHash } from '##/db-helpers/password-hash.js'

import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'
// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// router.put('/:id/profile', authenticate, async function (req, res) {
//   // 轉為數字
//   const id = Number(req.params.id)

//   // user為來自前端的會員資料(準備要修改的資料)
//   const member = req.body

//   // 對資料庫執行update
//   const [affectedRows] = await User.update(member, {
//     where: {
//       id,
//     },
//     logging: console.log,
//     individualHooks: true, // 更新時要加密密碼字串 trigger the beforeUpdate hook
//   })

//   // 沒有更新到任何資料 -> 失敗或沒有資料被更新
//   if (!affectedRows) {
//     return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
//   }

//   // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
//   const updatedMember = await User.findByPk(id, {
//     raw: true, // 只需要資料表中資料
//   })

//   // password資料不需要回應給瀏覽器
//   // delete updatedMember.phonenumber
//   // delete updatedMember.address
//   // 回傳
//   return res.json({ status: 'success', data: { member: updatedMember } })
// })

// 會員得到個人資料用
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料

  // 用一般sql
  // const [rows] = await db.query(`SELECT * FROM WHERE id=?`, [id])
  // const member = rows[0]

  // ORM
  const member = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼
  delete member.password

  return res.json({ status: 'success', data: { member } })
})

// 使用一般mysql+SQL的語法
// router.post('/', async function (req, res) {
//   // req.body資料範例
//   // {
//   //     "name":"金妮",
//   //     "email":"ginny@test.com",
//   //     "username":"ginny",
//   //     "password":"12345"
//   // }

//   // 要新增的會員資料
//   const newMember = req.body

//   // 檢查從前端來的資料哪些為必要(name, username...)
//   if (
//     !newMember.account ||
//     !newMember.password ||
//     !newMember.username ||
//     !newMember.birthdate ||
//     !newMember.phonenumber ||
//     !newMember.idnumber ||
//     !newMember.email ||
//     !newMember.address
//   ) {
//     return res.json({ status: 'error', message: '缺少必要資料' })
//   }

//   // 先檢查username或是email不能有相同的
//   const [rows] = await db.query(
//     `SELECT * FROM member WHERE account = ? OR email = ?`,
//     [newMember.account, newMember.email]
//   )

//   console.log(rows)

//   if (rows.length > 0) {
//     return res.json({
//       status: 'error',
//       message: '建立會員失敗，有重覆的帳號或email',
//     })
//   }

//   // 以下是準備新增會員
//   // 1. 進行密碼編碼
//   const passwordHash = await generateHash(newMember.password)

//   // 2. 新增到資料表
//   const [rows2] = await db.query(
//     `INSERT INTO member(account, password, username, birthdate, phonenumber,idnumber, email, address, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//     [
//       newMember.account,
//       passwordHash,
//       newMember.username,
//       newMember.birthdate,
//       newMember.phonenumber,
//       newMember.idnumber,
//       newMember.email,
//       newMember.address,
//     ]
//   )

//   console.log(rows2)

//   if (!rows2.insertId) {
//     return res.json({
//       status: 'error',
//       message: '建立會員失敗，資料庫錯誤',
//     })
//   }

//   // 成功建立會員的回應
//   // 狀態`201`是建立資料的標準回應，
//   // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
//   // res.location(`/users/${user.id}`)
//   return res.status(201).json({
//     status: 'success',
//     data: null,
//   })
// })

// 使用sequelize ORM的語法
// router.post('/orm', async function (req, res) {
//   // req.body資料範例
//   // {
//   //     "name":"金妮",
//   //     "email":"ginny@test.com",
//   //     "username":"ginny",
//   //     "password":"12345"
//   // }

//   // 要新增的會員資料
//   const newMember = req.body

//   // 檢查從前端來的資料哪些為必要(name, username...)
//   if (
//     !newMember.account ||
//     !newMember.password ||
//     !newMember.username ||
//     !newMember.birthdate ||
//     !newMember.phonenumber ||
//     !newMember.idnumber ||
//     !newMember.email ||
//     !newMember.address
//   ) {
//     return res.json({ status: 'error', message: '缺少必要資料' })
//   }

//   // 執行後user是建立的會員資料，created為布林值
//   // where指的是不可以有相同的資料，如username或是email不能有相同的
//   // defaults用於建立新資料用需要的資料
//   const [member, created] = await User.findOrCreate({
//     where: {
//       [Op.or]: [{ account: newMember.account }, { email: newMember.email }],
//     },
//     defaults: {
//       account: newMember.account,
//       password: newMember.password,
//       username: newMember.username,
//       birthdate: newMember.birthdate,
//       phonenumber: newMember.phonenumber,
//       idnumber: newMember.idnumber,
//       email: newMember.email,
//       address: newMember.address,
//     },
//   })

//   // 新增失敗 created=false 代表沒新增
//   if (!created) {
//     return res.json({ status: 'error', message: '建立會員失敗' })
//   }

//   // 成功建立會員的回應
//   // 狀態`201`是建立資料的標準回應，
//   // 如有必要可以加上`Location`會員建立的url在回應標頭中，或是回應剛建立的資料
//   // res.location(`/users/${user.id}`)
//   return res.status(201).json({
//     status: 'success',
//     data: null,
//   })
// })

router.post('/login', async (req, res) => {
  // 從前端來的資料 req.body = { username:'xxxx', password :'xxxx'}
  const loginUser = req.body

  // 檢查從前端來的資料哪些為必要
  if (!loginUser.username || !loginUser.password) {
    return res.json({ status: 'fail', data: null })
  }

  // 查詢資料庫，是否有這帳號與密碼的使用者資料
  // 方式一: 使用直接查詢
  // const user = await sequelize.query(
  //   'SELECT * FROM user WHERE username=? LIMIT 1',
  //   {
  //     replacements: [loginUser.username], //代入問號值
  //     type: QueryTypes.SELECT, //執行為SELECT
  //     plain: true, // 只回傳第一筆資料
  //     raw: true, // 只需要資料表中資料
  //     logging: console.log, // SQL執行呈現在console.log
  //   }
  // )

  // 方式二: 使用模型查詢
  const member = await User.findOne({
    where: {
      username: loginUser.username,
    },
    raw: true, // 只需要資料表中資料
  })

  // console.log(user)

  // user=null代表不存在
  if (!member) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(loginUser.password, member.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  const returnUser = {
    id: member.id,
    username: member.username,
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  res.json({
    status: 'success',
    data: { accessToken },
  })
})

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'members' })
// })

export default router
