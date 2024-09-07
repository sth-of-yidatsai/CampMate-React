import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql+sql 來查詢
import db from '#configs/mysql.js'

// 資料庫使用sequelize
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { Collect_Campground } = sequelize.models

// 中介軟體，存取隱私會員資料用
import authenticate from '##/middlewares/authenticate.js'

// 找到所有營地的資訊
router.get('/', async function (req, res) {
  // where條件 ----- START
  const conditions = []
  // 分每個條件加入到conditions陣列

  // 名稱 關鍵字(查詢字串QS: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like
    ? `campground_name LIKE '%${name_like}%' OR city LIKE '%${name_like}%' OR area LIKE '%${name_like}%'`
    : ''

  // 設施 複選 (查詢字串QS: facility=Apple,Google)
  const facilities = req.query.facility ? req.query.facility.split(',') : []
  let facilities_str = facilities.map((v) => `'${v}'`).join(`,`)
  facilities_str = 'f.f_name IN (' + facilities_str + ')'
  conditions[1] = facilities.length > 0 ? facilities_str : ''

  // 房間用品 複選 (查詢字串QS: provides=Apple,Google)
  const provides = req.query.provide ? req.query.provide.split(',') : []
  let provides_str = provides.map((v) => `'${v}'`).join(`,`)
  provides_str = 'p.p_name IN (' + provides_str + ')'
  conditions[2] = provides.length > 0 ? provides_str : ''

  // 評分 單選 (查詢字串QS: rating=3.5)
  const rating = Number(req.query.rating) || 0

  // 價格, 5000~150000 (查詢字串QS: price_gte=5000&price_lte=15000)
  const price_gte = Number(req.query.priceGte) || 0 // 最小價格
  const price_lte = Number(req.query.priceLte) || 10500 // 最大價格
  let having = `HAVING MIN(r.price_per_day) BETWEEN ${price_gte} AND ${price_lte}`
  if (facilities.length > 0) {
    having += ` AND COUNT(DISTINCT f.f_name) = ${facilities.length}`
  }
  if (provides.length > 0) {
    having += ` AND COUNT(DISTINCT p.p_name) = ${provides.length}`
  }
  if (rating > 0) {
    having += ` AND AVG(rv.rating) > ${rating}`
  }

  // 組合成where從句
  // 1. 過濾空白的條件
  const cvs = conditions.filter((v) => v)
  // 2. 用AND串接所有從句
  let where =
    cvs.length > 0 ? 'WHERE ' + cvs.map((v) => `( ${v} )`).join(` AND `) : ''

  console.log(where)

  // 排序 (查詢字串 QS : sort=price&order=asc)
  const sort = req.query.sort || 'id'
  const order = req.query.order || 'asc'

  // 允許的排序的欄位字串
  const sortList = ['id', 'price', 'rating']
  const orderList = ['asc', 'desc']

  // 分頁 (查詢字串QS: page=2&perpage=5)
  // 預設值(前後端要一致) page = 1, perpage = 10
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 5
  const offset = (page - 1) * perpage
  const limit = perpage

  // 檢查要可用的sort與order字串
  let orderby = ''
  if (orderList.includes(order) && sortList.includes(sort)) {
    if (sort === 'id') {
      orderby = `ORDER BY id ${order}`
    } else if (sort === 'price') {
      orderby = `ORDER BY min_price ${order}`
    } else if (sort === 'rating') {
      orderby = `ORDER BY avg_rating ${order}`
    }
  }
  console.log(
    `SELECT c.*, MIN(r.price_per_day) AS min_price, f.f_name, p.p_name, AVG(rv.rating) AS avg_rating, COUNT(rv.rating) AS total_ratings FROM campground_info c LEFT JOIN room r ON c.id = r.campground_id LEFT JOIN campground_facility f ON c.id = f.campground_id LEFT JOIN provide p ON c.id = p.campground_id LEFT JOIN review rv ON c.id = rv.campground_id ${where} GROUP BY c.id ${having} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  )
  const [rows] = await db.query(
    `SELECT c.*, MIN(r.price_per_day) AS min_price, f.f_name, p.p_name, AVG(rv.rating) AS avg_rating, COUNT(rv.rating) AS total_ratings FROM campground_info c LEFT JOIN room r ON c.id = r.campground_id LEFT JOIN campground_facility f ON c.id = f.campground_id LEFT JOIN provide p ON c.id = p.campground_id LEFT JOIN review rv ON c.id = rv.campground_id ${where} GROUP BY c.id ${having} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  )

  const campgrounds = rows

  // 查詢在這頁的商品資料
  // sql套用各值的順序 where orderby limit+offset

  // 計算在此條件下總共多少筆(WHERE)
  const [rows2] = await db.query(
    `SELECT c.id, COUNT(*) AS record_count, MIN(r.price_per_day) AS min_price, f.f_name, p.p_name, AVG(rv.rating) AS avg_rating FROM campground_info c LEFT JOIN room r ON c.id = r.campground_id LEFT JOIN campground_facility f ON c.id = f.campground_id LEFT JOIN provide p ON c.id = p.campground_id LEFT JOIN review rv ON c.id = rv.campground_id ${where} GROUP BY c.id ${having} ${orderby}`
  )
  const count = rows2.length

  const [rows3] = await db.query(
    `SELECT c.*, MIN(r.price_per_day) AS min_price, f.f_name, p.p_name, AVG(rv.rating) AS avg_rating FROM campground_info c LEFT JOIN room r ON c.id = r.campground_id LEFT JOIN campground_facility f ON c.id = f.campground_id LEFT JOIN provide p ON c.id = p.campground_id LEFT JOIN review rv ON c.id = rv.campground_id ${where} GROUP BY c.id ${having} ${orderby}`
  )

  const without_page_campgrounds = rows3

  const [ratingRows] = await db.query(
    `SELECT c.id AS campground_id, c.campground_name AS c_name, COUNT(rv.rating) AS total_ratings FROM campground_info c LEFT JOIN review rv ON c.id = rv.campground_id GROUP BY c.id, c.campground_name;`
  )
  const eachComment = ratingRows

  // 計算總頁數
  const pageCount = Math.ceil(count / perpage)
  // console.log(pageCount)

  if (!campgrounds) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到營地',
    })
  }

  // 標準回傳JSON
  return res.status(200).json({
    status: 'success',
    data: {
      total: count, // 總筆數
      // pageCount: pageCount, // 總頁數
      // page, // 目前頁
      // perpage, // 每頁筆數
      campgrounds,
      without_page_campgrounds,
      eachComment,
      pageCount,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [row] = await db.query(
    `SELECT c.*, AVG(rv.rating) AS avg_rating, MIN(r.price_per_day) AS min_price
    FROM campground_info c
    LEFT JOIN room r ON c.id = r.campground_id
    LEFT JOIN review rv ON c.id = rv.campground_id
    WHERE c.id = ?
    GROUP BY c.id`,
    [id]
  )
  const campground = row[0]
  const [commentRows] = await db.query(
    `SELECT c.id AS campground_id, COUNT(rv.rating) AS total_ratings FROM campground_info c LEFT JOIN review rv ON c.id = rv.campground_id where c.id = ?`,
    [id]
  )
  const total_comment = commentRows[0].total_ratings

  const [ratingRows] = await db.query(
    `SELECT * FROM review WHERE campground_id = ?`,
    [id]
  )
  const rating = ratingRows

  const [roomRows] = await db.query(
    `SELECT * FROM room WHERE campground_id = ?`,
    [id]
  )
  const rooms = roomRows

  const [campImgRows] = await db.query(
    `SELECT path FROM campground_img WHERE campground_id = ?;`,
    [id]
  )
  const campImg = campImgRows

  const [roomImgRows] = await db.query(
    `SELECT room_img.*
    FROM room
    JOIN room_img ON room.id = room_img.room_id
    WHERE room.campground_id =  ?`,
    [id]
  )
  const roomImg = roomImgRows

  return res.json({
    status: 'success',
    data: { campground, total_comment, rating, rooms, campImg, roomImg },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id/room', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)
  const people = req.query.people || 1

  const [roomRows] = await db.query(
    `SELECT * FROM room WHERE campground_id = ? AND room_people >= ?`,
    [id, people]
  )
  const rooms = roomRows

  return res.json({
    status: 'success',
    data: { rooms },
  })
})

router.get('/collect/:campground_id', authenticate, async (req, res) => {
  const user_id = req.user.id // 從認證取得id
  const { campground_id } = req.params

  try {
    // 查询是否存在该用户和营地的收藏记录
    const favorite = await Collect_Campground.findOne({
      where: { user_id, campground_id },
    })

    if (favorite) {
      // 如果存在，返回 200 状态码和收藏状态
      res.status(200).json({ like: true, user_id: user_id })
    } else {
      // 如果不存在，返回 200 状态码和收藏状态
      res.status(200).json({ like: false, user_id: user_id })
    }
  } catch (error) {
    console.error('Error checking favorite status:', error)
    res.status(500).json({ message: 'Internal server error', user_id: user_id })
  }
})

router.post('/collect', authenticate, async (req, res) => {
  // const campground_id = Number(req.params.id)
  const user_id = req.user.id // 從認證取得id
  console.log('userID:' + user_id)
  // const user_id = 1
  // if (!campground_id) {
  //   return res
  //     .status(400)
  //     .json({ status: 'error', message: 'Product ID is required' })
  // }
  const { campground_id } = req.body

  try {
    // 查找是否已经存在该收藏记录
    const existingFavorite = await Collect_Campground.findOne({
      where: { user_id, campground_id },
    })

    if (existingFavorite) {
      // 如果存在，刪除紀錄
      await Collect_Campground.destroy({
        where: { user_id, campground_id },
      })
      return res.status(200).json({ message: 'Favorite removed' })
    }

    // 如果不存在，創建新的紀錄
    const favorite = await Collect_Campground.create({ user_id, campground_id })
    res.status(201).json({ message: '新增收藏成功' })
  } catch (error) {
    console.error('Error processing favorite request:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
