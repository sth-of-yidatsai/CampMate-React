import express from 'express'
const router = express.Router()
import moment from 'moment'

// 資料庫使用
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { C_Order, User_Coupon } = sequelize.models

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js'

// 找全部訂單
router.get('/', authenticate, async function (req, res) {
  try {
    const user_id = req.user.id
    const { status, check_in_date, check_out_date } = req.query // 從查詢字符串中提取參數

    // 計算當天日期
    const today = moment().startOf('day').toDate() // 獲取當天的開始時間

    // 分頁 (查詢字串QS: page=2&perpage=5)
    // 預設值(前後端要一致) page = 1, perpage = 10
    const page = Number(req.query.page) || 1
    const perpage = 5
    const offset = (page - 1) * perpage
    const limit = perpage

    // 構建過濾條件
    const whereConditions = { user_id: user_id }

    if (status) {
      whereConditions.status = status
    }

    if (check_in_date) {
      const checkInDate = new Date(check_in_date)
      // 檢查 check_in_date 是否早於當天日期
      whereConditions.check_in_date = { [Op.gt]: today }
    }

    if (check_out_date) {
      const checkOutDate = new Date(check_out_date)
      // 檢查 check_in_date 是否早於當天日期
      whereConditions.check_in_date = { [Op.lt]: today }
    }

    // 查詢所有符合條件的訂單
    const orders = await C_Order.findAll({
      where: whereConditions,
      order: [['check_in_date', 'ASC']],
      limit: limit,
      offset: offset,
      logging: console.log, // 用於調試 SQL 查詢
    })

    const allOrders = await C_Order.findAll({
      where: whereConditions,
      order: [['check_in_date', 'ASC']],
      logging: console.log, // 用於調試 SQL 查詢
    })

    // 處理如果沒找到資料
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', data: null, message: 'No orders found' })
    }
    // 計算總頁數
    const count = allOrders.length
    const pageCount = Math.ceil(count / perpage)

    // 標準回傳 JSON
    return res.json({ status: 'success', data: { orders, pageCount } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// 找優惠券
router.get('/user_coupon', authenticate, async function (req, res) {
  try {
    const user_id = req.user.id
    // const filter = req.query.filter || '已領取'
    const pay_amount = req.query.pay_amount || 0
    // const page = parseInt(req.query.page, 10) || 1
    // const itemsPerPage = 10
    // const offset = (page - 1) * itemsPerPage

    let query = `
      SELECT uc.*, c.* FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.user_id = ? 
    `
    const params = [user_id]

    // filter
    query += ' AND c.status = ?'
    params.push('可使用')
    // pay_amount
    query += ' AND c.min_cost < ?'
    params.push(pay_amount)
    // 限制露營區
    query += " AND c.type != '露營用品'"
    // 限制為未使用過的 Coupon
    query += " AND uc.status = '未使用'"

    const [userCoupons] = await db.query(query, params)

    return res.json({
      status: 'success',
      data: { userCoupons },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// 找單筆訂單
router.get('/:order_number', async function (req, res) {
  // 轉為數字
  const order_number = req.params.order_number

  const [row] = await db.query('SELECT * FROM c_order where order_number = ?', [
    order_number,
  ])
  const order = row[0]

  return res.json({ status: 'success', data: { order } })
})

router.post('/', async function (req, res) {
  // req.body資料範例
  // {
  //    "room_id":"1",
  //    "check_in_date": "2024-8-18",
  //    "check_out_date": "2024-8-20",
  //    "pay_amount": 3000,
  //    "status": "付款完成",
  //    "user_id": 1,
  //    "order_number": "f5b28675-f95e-4cbe-a5b5-3dbbfd23ee72",
  //    "valid": 1
  // }

  // "status": "付款完成",
  // "user_id": 1
  // "valid": 1
  // user 等登入系統做出來再寫

  // 要新增的訂單資料
  const {
    room_id,
    check_in_date,
    check_out_date,
    people,
    pay_amount,
    user_id,
    status,
    last_name,
    first_name,
    phone,
    email,
    note,
    coupon_id,
  } = req.body

  //   if (!room_id || !pay_amount) {
  //     return res.json({ status: 'error', message: '缺少必要資料' })
  //   }
  try {
    const newOrder = await C_Order.create({
      room_id,
      check_in_date,
      check_out_date,
      people,
      amount: pay_amount,
      user_id,
      status,
      last_name,
      first_name,
      phone,
      email,
      note,
      coupon_id,
    })
    res.status(201).json({
      status: 'success',
      message: '訂單新增成功',
      data: newOrder,
      orderId: newOrder.id,
      order_number: newOrder.order_number,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ status: 'error', error: error })
  }
})

// PUT - 更新優惠券使用狀態
router.put('/user_coupon', authenticate, async function (req, res) {
  const user_id = req.user.id

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料(先沒辦法檢查)
  // if (req.user.id !== id) {
  //   return res.json({ status: 'error', message: '存取會員資料失敗' })
  // }

  // user為來自前端的會員資料(準備要修改的資料)
  const user_coupon = req.body

  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)
  if (!user_id || !user_coupon.coupon_id) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 查詢資料庫目前的資料
  const dbUserCoupon = await User_Coupon.findOne({
    where: {
      user_id: user_id,
      coupon_id: user_coupon.coupon_id,
    },
    raw: true, // 只需要資料表中資料
  })

  // null代表不存在
  if (!dbUserCoupon) {
    return res.json({ status: 'error', message: '使用者沒有這個優惠券' })
  }

  // // 有些特殊欄位的值沒有時要略過更新，不然會造成資料庫錯誤
  // if (!user.birth_date) {
  //   delete user.birth_date
  // }

  const coupon = {
    status: '已使用',
    c_order_id: user_coupon.order_number,
  }

  // 對資料庫執行update
  const [affectedRows] = await User_Coupon.update(coupon, {
    where: {
      user_id: user_id,
      coupon_id: user_coupon.coupon_id,
    },
  })

  // 沒有更新到任何資料 -> 失敗或沒有資料被更新
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
  }

  // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
  const updatedUser = await User_Coupon.findOne({
    where: {
      user_id: user_id,
      coupon_id: user_coupon.coupon_id,
    },
    raw: true, // 只需要資料表中資料
  })

  console.log(updatedUser)
  // 回傳
  return res.json({ status: 'success', data: { user_coupon: updatedUser } })
})

router.put('/:order_number', authenticate, async function (req, res) {
  const user_id = req.user.id
  const order_number = req.params.order_number
  // 檢查是否為授權會員，只有授權會員可以存取自己的資料(先沒辦法檢查)
  // if (req.user.id !== id) {
  //   return res.json({ status: 'error', message: '存取會員資料失敗' })
  // }

  // 查詢資料庫目前的資料
  const dbOrder = await C_Order.findOne({
    where: {
      order_number: order_number,
    },
    raw: true, // 只需要資料表中資料
  })

  // null代表不存在
  if (!dbOrder) {
    return res.json({ status: 'error', message: '沒有這個訂單' })
  }

  const order = {
    status: 'paid',
  }

  // 對資料庫執行update
  const [affectedRows] = await C_Order.update(order, {
    where: {
      order_number: order_number,
    },
  })

  // 沒有更新到任何資料 -> 失敗或沒有資料被更新
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
  }

  // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
  const updatedOrder = await C_Order.findOne({
    where: {
      order_number: order_number,
    },
    raw: true, // 只需要資料表中資料
  })

  console.log(updatedOrder)
  // 回傳
  return res.json({ status: 'success', data: { c_order: updatedOrder } })
})

export default router
