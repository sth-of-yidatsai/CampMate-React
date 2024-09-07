import express from 'express'
import jwt from 'jsonwebtoken'
const router = express.Router()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// 資料庫使用 sequelize
import { Op, where } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 驗証加密密碼字串用
import { compareHash } from '#db-helpers/password-hash.js'

// 中介軟體，存取隱私會員資料用
import authenticate from '##/middlewares/authenticate.js'

// 上傳檔案用使用multer
import path from 'path'
import multer from 'multer'

// multer的設定值 - START
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // 存放目錄
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    // 經授權後，req.user帶有會員的id
    const newFilename = req.user.id
    // 新檔名由表單傳來的req.body.newFilename決定
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })
// multer的設定值 - END

// GET - 得到所有會員資料
router.get('/', async function (req, res) {
  const users = await User.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { users } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/comment/:id', async function (req, res) {
  const id = getIdParam(req)

  try {
    const user = await User.findByPk(id, {
      attributes: ['name', 'photo_url'], // 只選取需要的欄位
      raw: true, // 只需要資料表中資料
    })

    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' })
    }

    return res.json({ status: 'success', data: { user } })
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', authenticate, async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const user = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼
  delete user.password

  return res.json({ status: 'success', data: { user } })
})

// 找登入中 user 所有的營地訂單
router.get('/c-order', authenticate, async function (req, res) {
  // 轉為數字
  const user_id = req.user.id

  const [row] = await db.query('SELECT * FROM c_order where user_id = ?', [
    user_id,
  ])
  const order = row[0]

  return res.json({ status: 'success', data: { order } })
})

// POST - 新增會員資料
router.post('/', async function (req, res) {
  // req.body資料範例
  // {
  //     "account": "herry@test.com",
  //     "name": "哈利",
  //     "username": "herry",
  //     "password": "11111",
  //     "email": "herry@test.com",
  //     "id_number": "B122566487",
  //     "avatar": "1.webp",
  //     "birth_date": "1980-07-13",
  //     "phone": "0906102808",
  //     "address": "桃園市桃園區劉南路377號18樓",
  // }

  // 要新增的會員資料
  const newUser = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newUser.account ||
    !newUser.username ||
    !newUser.password ||
    !newUser.birth_date ||
    !newUser.phone ||
    !newUser.id_number ||
    !newUser.email ||
    !newUser.address
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 執行後user是建立的會員資料，created為布林值
  // where指的是不可以有相同的資料，如username或是email不能有相同的
  // defaults用於建立新資料用需要的資料
  const [user, created] = await User.findOrCreate({
    where: {
      [Op.or]: [{ account: newUser.account }],
    },
    defaults: {
      account: newUser.account,
      username: newUser.username,
      password: newUser.password,
      birth_date: newUser.birth_date,
      phone: newUser.phone,
      id_number: newUser.id_number,
      email: newUser.email,
      address: newUser.address,
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
