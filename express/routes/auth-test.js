import express from 'express'
const router = express.Router()

import jwt from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '##/middlewares/authenticate.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 資料庫使用
import { QueryTypes } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 驗証加密密碼字串用
import { compareHash } from '#db-helpers/password-hash.js'
import Member from '##/models/Member.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.put('/:id/profile', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  // user為來自前端的會員資料(準備要修改的資料)
  const member = req.body

  // 對資料庫執行update
  const [affectedRows] = await User.update(member, {
    where: {
      id,
    },
    logging: console.log,
    // individualHooks: true, // 更新時要加密密碼字串 trigger the beforeUpdate hook
  })

  // 沒有更新到任何資料 -> 失敗或沒有資料被更新
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
  }

  // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
  const updatedMember = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // password資料不需要回應給瀏覽器
  // delete updatedMember.phonenumber
  // delete updatedMember.address
  // 回傳
  return res.json({ status: 'success', data: { member: updatedMember } })
})

/// 檢查登入狀態用
router.get('/check', authenticate, async (req, res) => {
  // 查詢資料庫目前的資料
  const user = await User.findByPk(req.user.id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼值
  delete user.password
  return res.json({ status: 'success', data: { user } })
})

//認證資料庫帳號密碼
router.post('/login', async (req, res) => {
  // 從前端來的資料 req.body = { username:'xxxx', password :'xxxx'}
  const loginUser = req.body
  console.log(loginUser)

  // 檢查從前端來的資料哪些為必要
  if (!loginUser.account || !loginUser.password) {
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
  const user = await User.findOne({
    where: {
      account: loginUser.account,
    },
    raw: true, // 只需要資料表中資料
  })

  console.log(user)

  // user=null代表不存在
  if (!user) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(loginUser.password, user.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  const returnUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    birth_date: user.birth_date,
    id_number: user.id_number,
    phone: user.phone,
    address: user.address,
    photo_url: user.photo_url,
    google_uid: user.google_uid,
    line_uid: user.line_uid,
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jwt.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  res.status(200).json({
    status: 'success',
    data: { accessToken },
  })
})

router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

// 會員註冊
router.post('/', async function (req, res) {
  const newMember = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newMember.account ||
    !newMember.password ||
    !newMember.username ||
    !newMember.email ||
    !newMember.id_number ||
    !newMember.birth_date ||
    !newMember.phone ||
    !newMember.address
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 執行後user是建立的會員資料，created為布林值
  // where指的是不可以有相同的資料，如username不能有相同的
  // defaults用於建立新資料用需要的資料
  const [user, created] = await User.findOrCreate({
    where: {
      [QueryTypes.or]: [{ account: newMember.account }],
    },
    defaults: {
      account: newMember.account,
      password: newMember.password,
      username: newMember.username,
      email: newMember.email,
      id_number: newMember.id_number,
      birth_date: newMember.birth_date,
      phone: newMember.phone,
      address: newMember.address,
    },
  })

  // 新增失敗 created=false 代表沒新增
  if (!created) {
    return res.json({ status: 'error', message: '建立會員失敗' })
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})
export default router
