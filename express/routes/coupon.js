import express from 'express'
const router = express.Router()
import db from '#configs/mysql.js' // 引入mysql配置
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層

// GET - 取得會員擁有的所有優惠券（支持篩選與分頁）
router.get('/user_coupon', authenticate, async function (req, res) {
  try {
    console.log('Request user ID:', req.user.id) // 確認 user_id 是否正確
    const user_id = req.user.id
    const filter = req.query.filter || '已領取'
    const page = parseInt(req.query.page, 10) || 1
    const itemsPerPage = 10
    const offset = (page - 1) * itemsPerPage

    let query = `
      SELECT uc.*, c.* FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.user_id = ?
    `
    const params = [user_id]

    switch (filter) {
      case '已使用':
        query += ' AND uc.status = ?'
        params.push('已使用')
        break
      case '未使用':
        query += ' AND uc.status = ?'
        params.push('未使用')
        break
      case '稍後可用':
        query += ' AND c.status = ?'
        params.push('稍後使用')
        break
      case '可使用':
        query += ' AND c.status = ?'
        params.push('可使用')
        break
      case '已過期':
        query += ' AND c.status = ?'
        params.push('已過期')
        break
      default:
        // 已領取：不添加任何額外的條件
        break
    }

    // 根據 received_at 降冪排序並分頁
    query += ' ORDER BY uc.received_at DESC LIMIT ? OFFSET ?'
    params.push(itemsPerPage, offset)

    const [userCoupons] = await db.query(query, params)

    // 計算總數量，用於分頁
    const [totalResult] = await db.query(
      `SELECT COUNT(*) as count FROM user_coupon uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?` + (filter !== '已領取' ? ' AND c.status = ?' : ''),
      filter !== '已領取' ? [user_id, params[1]] : [user_id]
    )

    // 分頁
    const totalPages = Math.ceil(totalResult[0].count / itemsPerPage)

    return res.json({
      status: 'success',
      data: { userCoupons, totalPages, currentPage: page },
    })
  } catch (error) {
    console.error('Error fetching user coupons:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Server error', detail: error.message })
  }
})

// GET - 取得所有 "可使用" 和 "稍後使用" 狀態的優惠券資料，支持篩選與分頁
router.get('/', async function (req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const itemsPerPage = 10
    const offset = (page - 1) * itemsPerPage
    const type = req.query.type || null

    let query = 'SELECT * FROM coupon WHERE status IN ("可使用", "稍後使用")'
    const params = []

    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }

    // 根據 start_date 升冪排序並分頁
    query += ' ORDER BY start_date ASC LIMIT ? OFFSET ?'
    params.push(itemsPerPage, offset)

    const [coupons] = await db.query(query, params)

    // 計算總數量，用於分頁
    const [totalCoupons] = await db.query(
      'SELECT COUNT(*) as count FROM coupon WHERE status IN ("可使用", "稍後使用")' +
        (type ? ' AND type = ?' : ''),
      type ? [type] : []
    )

    // 計算總頁數
    const totalPages = Math.ceil(totalCoupons[0].count / itemsPerPage)

    if (coupons.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No coupons found' })
    }

    return res.json({
      status: 'success',
      data: { coupons, totalPages, currentPage: page },
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 取得所有 "可使用" 狀態的優惠券資料，不進行分頁
router.get('/available', async function (req, res) {
  try {
    const type = req.query.type || null

    // 構建查詢字符串和參數數組
    let query = 'SELECT * FROM coupon WHERE status = "可使用"'
    const params = []

    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }

    // 根據 start_date 升冪排序
    query += ' ORDER BY start_date ASC'

    const [coupons] = await db.query(query, params)

    if (coupons.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No available coupons found' })
    }

    return res.json({
      status: 'success',
      data: { coupons },
    })
  } catch (error) {
    console.error('Error fetching available coupons:', error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 取得單筆優惠券資料
router.get('/:id', async function (req, res) {
  try {
    const [coupon] = await db.query('SELECT * FROM coupon WHERE id = ?', [
      req.params.id,
    ])
    if (coupon.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Coupon not found' })
    }
    return res.json({ status: 'success', data: coupon[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// POST - 會員領取優惠券
router.post('/receive', async function (req, res) {
  try {
    const { user_id, coupon_id } = req.body

    // 檢查優惠券是否存在
    const [coupon] = await db.query('SELECT * FROM coupon WHERE id = ?', [
      coupon_id,
    ])
    if (coupon.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Coupon not found' })
    }

    // 檢查會員是否已領取此優惠券
    const [existingUserCoupon] = await db.query(
      'SELECT * FROM user_coupon WHERE user_id = ? AND coupon_id = ?',
      [user_id, coupon_id]
    )
    if (existingUserCoupon.length > 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Coupon already received' })
    }

    // 插入新的 user_coupon 資料
    const [result] = await db.query(
      'INSERT INTO user_coupon (user_id, coupon_id, status, received_at) VALUES (?, ?, ?, NOW())',
      [user_id, coupon_id, '未使用']
    )
    return res.json({ status: 'success', data: { id: result.insertId } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 取得單一用戶的所有優惠券（根據用戶 ID）
router.get('/user_coupon/:user_id', async function (req, res) {
  try {
    const userId = parseInt(req.params.user_id, 10)

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user ID' })
    }

    let query = `
      SELECT uc.*, c.* FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.user_id = ?
    `
    const params = [userId]

    // 根據 received_at 降冪排序
    query += ' ORDER BY uc.received_at DESC'

    const [userCoupons] = await db.query(query, params)

    if (userCoupons.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No coupons found for this user' })
    }

    return res.json({ status: 'success', data: { userCoupons } })
  } catch (error) {
    console.error('Error fetching user coupons:', error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// GET - 取得單筆會員擁有的優惠券詳情
router.get('/user/:user_id/coupon/:coupon_id', async function (req, res) {
  try {
    const couponId = parseInt(req.params.coupon_id, 10)
    const userId = parseInt(req.params.user_id, 10)

    console.log(`couponId: ${couponId}, userId: ${userId}`)

    if (isNaN(couponId) || isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid coupon_id or user_id' })
    }

    const query = `
      SELECT uc.*, c.coupon_name, c.start_date, c.end_date, c.status as coupon_status 
      FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.coupon_id = ? AND uc.user_id = ?
    `

    console.log(`Executing SQL query: ${query}`)
    const [result] = await db.query(query, [couponId, userId])

    console.log('Query Result:', result)

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Coupon not found' })
    }

    return res.json({ status: 'success', data: result[0] })
  } catch (error) {
    console.error('Error fetching coupon detail:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Server error', detail: error.message })
  }
})

// GET - 檢查用戶是否已領取特定優惠券
router.get(
  '/user/:user_id/coupon/:coupon_id/status',
  authenticate,
  async function (req, res) {
    try {
      const couponId = parseInt(req.params.coupon_id, 10)
      const userId = parseInt(req.params.user_id, 10)

      if (isNaN(couponId) || isNaN(userId)) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid coupon_id or user_id' })
      }

      const query = `
      SELECT uc.status FROM user_coupon uc
      WHERE uc.coupon_id = ? AND uc.user_id = ?
    `

      const [result] = await db.query(query, [couponId, userId])

      if (result.length === 0) {
        return res.json({ status: 'success', data: { claimed: false } })
      }

      return res.json({
        status: 'success',
        data: { claimed: true, status: result[0].status },
      })
    } catch (error) {
      console.error('Error checking coupon status:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Server error',
        detail: error.message,
      })
    }
  }
)

// PATCH - 更新用戶的優惠券狀態
router.patch(
  '/user/:user_id/coupon/:coupon_id',
  authenticate,
  async function (req, res) {
    try {
      const couponId = parseInt(req.params.coupon_id, 10)
      const userId = parseInt(req.params.user_id, 10)
      const { status } = req.body // 新狀態應從前端提供

      if (isNaN(couponId) || isNaN(userId) || !status) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid input' })
      }

      const query = `
      UPDATE user_coupon 
      SET status = ? 
      WHERE coupon_id = ? AND user_id = ?
    `

      const [result] = await db.query(query, [status, couponId, userId])

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Coupon not found for user' })
      }

      return res.json({
        status: 'success',
        message: 'Coupon status updated successfully',
      })
    } catch (error) {
      console.error('Error updating coupon status:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Server error',
        detail: error.message,
      })
    }
  }
)

export default router
