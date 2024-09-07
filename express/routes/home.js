import express from 'express'
import multer from 'multer'
import db from '#configs/mysql.js'

const router = express.Router()
const upload = multer()

// 取得指定ID產品列表
router.get('/rent', async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : []
  const keyword = req.query.keyword || ''
  const sort_name = req.query.sort_name || ''
  const sort_orderBy = req.query.sort_orderBy || ''
  const category = req.query.cate || ''
  const search = keyword ? `AND p.product_name LIKE '%${keyword}%'` : ''
  const sort =
    sort_name && sort_orderBy
      ? `ORDER BY ${sort_name} ${sort_orderBy}`
      : `ORDER BY RAND()`
  const cate = category ? `AND cate1.cate_id = ${category}` : ''
  const idFilter = ids.length ? `AND p.product_id IN (${ids.join(',')})` : ''

  try {
    const mainQuery = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.main_img, 
      p.product_brief,  
      cate2.cate_name AS parent_name, 
      tag.tag_name AS brand_name, 
      MIN(price.product_price) AS price,
      AVG(pc.rating) AS avg_rating,  -- 計算平均評分
      COUNT(pc.rating) AS total_comments -- 計算評論數量
    FROM 
      rent_product AS p 
    JOIN 
      product_category AS cate1 ON p.cate_id = cate1.cate_id 
    LEFT JOIN 
      product_category AS cate2 ON cate1.parent_id = cate2.cate_id
    JOIN 
      product_relate_tag AS relate_tag ON p.product_id = relate_tag.product_id
    JOIN 
      product_tag AS tag ON relate_tag.tag_id = tag.tag_id
    JOIN 
      product_price AS price ON p.product_id = price.product_id
    LEFT JOIN 
      product_comment AS pc ON p.product_id = pc.product_id -- 聯結評論表
    WHERE 
      tag.parent_id = 1 
      ${search} 
      ${cate} 
      ${idFilter}
    GROUP BY 
      p.product_id 
    ${sort}
  `
    const [products_rows] = await db.query(mainQuery)

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取商品列表頁中，給予product_card的資訊。',
      product_data: products_rows,
    })
  } catch (err) {
    console.error(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：獲取商品資料錯誤，請洽客服單位。',
    })
  }
})

// 取得指定ID露營地列表
router.get('/campground', async (req, res) => {
  const ids = req.query.ids.split(',').map(Number)

  const placeholders = ids.map(() => '?').join(',')

  // 查詢露營地信息、最低價格、平均評分、評論數量
  const [campgrounds] = await db.query(
    `SELECT c.*, MIN(r.price_per_day) AS min_price, AVG(rv.rating) AS avg_rating, COUNT(rv.rating) AS total_comment
     FROM campground_info c
     LEFT JOIN room r ON c.id = r.campground_id
     LEFT JOIN review rv ON c.id = rv.campground_id
     WHERE c.id IN (${placeholders})
     GROUP BY c.id`,
    ids
  )

  if (campgrounds.length > 0) {
    // 查詢每個露營地的房間和圖片資料
    const detailedCampgrounds = await Promise.all(
      campgrounds.map(async (campground) => {
        const [rooms] = await db.query(
          `SELECT * FROM room WHERE campground_id = ?`,
          [campground.id]
        )

        const [campImgRows] = await db.query(
          `SELECT path FROM campground_img WHERE campground_id = ?`,
          [campground.id]
        )

        return {
          ...campground,
          rooms,
          campImg: campImgRows.map((img) => img.path), // 取得圖片路徑列表
        }
      })
    )

    return res.json({
      status: 'success',
      ground_data: detailedCampgrounds,
    })
  } else {
    return res.status(404).json({
      status: 'error',
      msg: 'No campgrounds found',
    })
  }
})

export default router
