import express from 'express'
import multer from 'multer'

import db from '#configs/mysql.js'

// import sequelize from '#configs/db.js'
// const { Rent_Product } = sequelize.models

const router = express.Router()
const upload = multer()

//** */ 取得所有商品資訊：
// ## GET
// ## query的內容格式
// {
//   keyword: '', //字串(文字) 放置要搜尋的商品關鍵字（沒有就給空值）
//   sort_name: '', //字串(文字) 想要讓他排序的欄位名稱 但是請先去看sql語法有抓什麼資料 (沒有就給空值)
//   sort_orderBy: '', //字串(文字) 想要讓他排序的升序或者降序 只能是 ASC 或 DESC (跟上面是一組的，上面如果是空值，這邊一樣要給空值)
//   category: '', //字串(數字) 放置要篩選的cate_id 去看product_category的資料表（沒有就給空值）
//   brand: [], //陣列 放置要搜尋的brand相關的標籤名稱（可以放置複數個） 標籤名稱請參考product_tag（沒有就給空值）
//   people: [], //陣列 放置要搜尋的people相關的標籤名稱（可以放置複數個） 標籤名稱請參考product_tag（沒有就給空值）
//   functional: [], //陣列 放置要搜尋的functional相關的標籤名稱（可以放置複數個） 標籤名稱請參考product_tag（沒有就給空值）
//   material: [], //陣列 放置要搜尋的material相關的標籤名稱（可以放置複數個） 標籤名稱請參考product_tag（沒有就給空值）
//   price: [], //陣列 放置要搜尋的price相關的標籤名稱（可以放置複數個） 標籤名稱請參考product_tag（沒有就給空值）
//   priceGte: '', //字串 放篩選價格的範圍（較低的）
//   priceLte: '', //字串 放篩選價格的範圍（較高的）
//   isRentHomePage: false,  //布林值 請設定為false
// }
router.get('/', async (req, res) => {
  console.log(req.query)

  // 抓取前端送來的要求內容
  const {
    keyword,
    sort_name,
    sort_orderBy,
    category,
    brand,
    people,
    functional,
    material,
    price,
    priceGte,
    priceLte,
    isRentHomePage,
  } = req.query

  try {
    // 這邊單純是獲取分類資訊 有機會要拆出去(還是要做try catch)
    const [category_rows] = await db.query(`
  SELECT 
  cate1.cate_id AS child_id, cate1.cate_name AS child_name, 
  cate2.cate_id AS parent_id, cate2.cate_name AS parent_name, cate1.parent_icon 
  FROM 
  product_category AS cate1 
  LEFT JOIN 
  product_category AS cate2 ON cate1.parent_id = cate2.cate_id
  `)

    // 處理標籤資訊 為了下面query語法的標籤群組便遍歷(還是要做try catch)
    const [tags_rows] = await db.query(`
  SELECT 
  tag2.tag_id AS parent_id, tag2.tag_name AS parent_name,
  GROUP_CONCAT(CASE WHEN tag1.parent_id = tag2.tag_id THEN tag1.tag_name END) AS child_tag
  FROM 
  product_tag AS tag1
  JOIN 
  product_tag AS tag2 ON tag1.parent_id = tag2.tag_id 
  GROUP BY
  tag2.tag_id
  `)

    // 將標籤分組顯示 會插入下面的sql語法中(還是要做try catch)
    const tags_group_query = tags_rows.map((tag, i) => {
      return `GROUP_CONCAT(DISTINCT CASE WHEN tag.parent_id = ${tag.parent_id} THEN tag.parent_id END) AS ${tag.parent_name}_id, 
        GROUP_CONCAT(DISTINCT CASE WHEN tag.parent_id = ${tag.parent_id} THEN tag.tag_name END) AS ${tag.parent_name}_child 
  `
    })

    let mainQuery = ` 
      SELECT 
      p.product_id, p.product_name, p.main_img, p.product_brief,  
      cate2.cate_name AS parent_name,
      ${tags_group_query},
      min_price_table.min_price AS price,
    min_price_table.price_id AS min_price_id 
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
      (SELECT 
          pp.product_id, 
          MIN(pp.product_price) AS min_price,
          pp.price_id
      FROM 
          product_price AS pp
      GROUP BY 
          pp.product_id) AS min_price_table 
          ON p.product_id = min_price_table.product_id 
      `

    // WHERE 語法的整合判斷
    let whereConditions = []
    if (keyword && keyword != '' && keyword != `undefined`) {
      whereConditions.push(`p.product_name LIKE '%${keyword}%'`)
    }

    if (
      priceGte &&
      priceLte &&
      priceGte != `undefined` &&
      priceLte != `undefined`
    ) {
      whereConditions.push(
        `min_price_table.min_price BETWEEN ${priceGte} AND ${priceLte}`
      )
    }

    if (category && category != '' && category != `undefined`) {
      whereConditions.push(`cate1.cate_id = ${category}`)
    }

    whereConditions.push(` p.product_status = 1 AND p.product_valid = 1`)

    if (whereConditions.length > 0) {
      mainQuery += ' WHERE ' + whereConditions.join(' AND ')
    }

    mainQuery += `
    GROUP BY p.product_id
    `

    // HAVING 語法的判斷與整合
    let havingConditions = []
    if (brand && brand != '' && brand != `undefined`) {
      const brand_arr = brand.split(',')
      const tagCondition = brand_arr
        .map((item, i) => `GROUP_CONCAT(tag.tag_name) LIKE '%${item}%'`)
        .join(` OR  `)

      havingConditions.push(`(${tagCondition})`)
    }
    if (people && people != '' && people != `undefined`) {
      const people_arr = people.split(',')
      const tagCondition = people_arr
        .map((item, i) => `GROUP_CONCAT(tag.tag_name) LIKE '%${item}%'`)
        .join(` OR  `)

      havingConditions.push(`(${tagCondition})`)
    }
    if (functional && functional != '' && functional != `undefined`) {
      const functional_arr = functional.split(',')
      const tagCondition = functional_arr
        .map((item, i) => `GROUP_CONCAT(tag.tag_name) LIKE '%${item}%'`)
        .join(` OR  `)

      havingConditions.push(`(${tagCondition})`)
    }
    if (material && material != '' && material != `undefined`) {
      const material_arr = material.split(',')
      const tagCondition = material_arr
        .map((item, i) => `GROUP_CONCAT(tag.tag_name) LIKE '%${item}%'`)
        .join(` OR  `)

      havingConditions.push(`(${tagCondition})`)
    }
    if (price && price != '' && price != `undefined`) {
      const price_arr = price.split(',')
      const tagCondition = price_arr
        .map((item, i) => `GROUP_CONCAT(tag.tag_name) LIKE '%${item}%'`)
        .join(` OR  `)

      havingConditions.push(`(${tagCondition})`)
    }

    if (havingConditions.length > 0) {
      mainQuery += ' HAVING ' + havingConditions.join(' AND ')
    }

    // ORDER BY 語法的判斷與整合
    let orderbyConditions = []
    if (
      isRentHomePage &&
      isRentHomePage != `false` &&
      isRentHomePage != `undefined`
    ) {
      orderbyConditions.push(`RAND()`)
    } else {
      if (
        sort_name &&
        sort_orderBy &&
        sort_name != `undefined` &&
        sort_orderBy != `undefined`
      ) {
        orderbyConditions.push(`${sort_name} ${sort_orderBy}`)
      }
    }

    if (orderbyConditions.length > 0) {
      mainQuery += ' ORDER BY  ' + orderbyConditions.join(' , ')
    }

    // 在首頁的時候 限制只能顯示前16個
    if (
      isRentHomePage &&
      isRentHomePage != `false` &&
      isRentHomePage != `undefined`
    ) {
      mainQuery += ` LIMIT 16 `
    }

    // console.log(mainQuery) // 檢查最後語法有沒有出錯用的(需要再取消註解)
    const [products_rows] = await db.query(mainQuery)

    //## <!-- ↑↑↑↑ 商品的主要搜尋 ↑↑↑↑ -->

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取商品列表頁中，給予product_card的資訊。',
      tags_data: tags_rows,
      categorys_data: category_rows,
      products_data: products_rows,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢全部商品時，SQL查詢錯誤。',
    })
  }
})

router.get('/shops', async (req, res) => {
  try {
    const [shops] = await db.query(`
      SELECT * FROM shop_info
      `)

    res.status(200).json({
      status: 'success',
      msg: '獲取取貨店資料成功！！',
      data: {
        shops,
      },
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢店面資訊時，SQL查詢錯誤。',
    })
  }
})

// ** 取得單一商品資訊:
// ## GET
// ## 只需要帶入id 即可得到對應的單一商品資料
router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const [users] = await db.query(`
    SELECT
    user.id, user.account, user.photo_url
    FROM
    user AS user
    `)

    const [shops_rows] = await db.query(`
      SELECT
      *
      FROM
      shop_info AS shop
      `)

    const [styles] = await db.query(`
          SELECT
          *
          FROM
          product_price
          WHERE
          product_id = ${id}
          AND style_name IS NOT NULL
          `)
    const [sizes] = await db.query(`
          SELECT
          *
          FROM
          product_price
          WHERE
          product_id = ${id}
          AND size_name IS NOT NULL
          `)

    const [price] = await db.query(`
          SELECT
          *
          FROM
          product_price
          WHERE
          product_id = ${id}
          AND size_name IS NULL 
          AND style_name IS NULL
          `)

    const [main_pic] = await db.query(`
        SELECT
        *
        FROM
        product_image AS img
        WHERE
        img.product_id = ${id}
        AND img.image_type = 1
        `)

    const [dev_pic] = await db.query(`
        SELECT
        *
        FROM
        product_image AS img
        WHERE
        img.product_id = ${id}
        AND img.image_type IS NULL
        `)

    const [des_pic] = await db.query(`
        SELECT
        *
        FROM
        product_image AS img
        WHERE
        img.product_id = ${id}
        AND img.image_type = 2
        `)

    const [comment] = await db.query(`
          SELECT
          comment.*, 
          ROUND(AVG(comment.rating) OVER (), 1) AS average_rating
          FROM
          product_comment AS comment
          WHERE
          comment.product_id = ${id}
          ORDER BY 
          comment.create_datetime DESC
          `)

    const mainQuery = `
    SELECT
    p.*,
    tag.tag_name AS brand_name
    FROM
    rent_product AS p 
    JOIN 
    product_relate_tag AS rTag ON p.product_id = rTag.product_id 
    JOIN
    product_tag AS tag ON rTag.tag_id = tag.tag_id 
    WHERE 
    p.product_id = ${id} 
    AND p.product_status = 1 
    AND p.product_valid = 1 
    AND tag.parent_id = 1 
    `

    // console.log(mainQuery)
    const [product_row] = await db.query(mainQuery)

    res.status(200).json({
      status: `success`,
      msg: '成功：獲取單一商品的資訊。',
      comment,
      shops_rows,
      product_row,
      main_pic,
      dev_pic,
      des_pic,
      styles,
      sizes,
      price,
      users,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單一商品時，SQL查詢錯誤。',
    })
  }
})

export default router
