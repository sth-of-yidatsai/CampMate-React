import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Group_Participant } = sequelize.models

// --------------------------------------------------------

// GET - 取所有participant資料
router.get('/', async function (req, res) {
  const participants = await Group_Participant.findAll({
    logging: console.log,
  })
  // 處理如果沒找到資料

  // 標準回傳JSON
  // return res.json({ status: 'success', data: { participants } })
  return res.json(participants)
})

// --------------------------------------------------------

// GET - 取單筆participant資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const participant = await Group_Participant.findByPk(id, {
    // findByPk以主鍵查詢
    raw: true, // 只需要資料表中資料
  })

  // return res.json({ status: 'success', data: { participant } })
  return res.json(participant)
})

// --------------------------------------------------------

// GET - 根據user_id取該user的所有event資料
router.get('/user/:user_id', async function (req, res) {
  const user_id = Number(req.params.user_id)

  const participants = await Group_Participant.findAll({
    where: { user_id },
    raw: true, // 只需要資料表中資料
  })

  return res.json(participants)
})

// --------------------------------------------------------

// GET - 根據event_id取該event的所有participant資料
router.get('/event/:event_id', async function (req, res) {
  const event_id = Number(req.params.event_id)

  const participants = await Group_Participant.findAll({
    where: { event_id },
    raw: true, // 只需要資料表中資料
  })

  return res.json(participants)
})

// --------------------------------------------------------

// GET - 根據user_id和 event_id取該user的個別活動報名資料 // 退出團露
router.get('/user/:user_id/:event_id', async function (req, res) {
  const user_id = Number(req.params.user_id)
  const event_id = Number(req.params.event_id)

  const event = await Group_Participant.findAll({
    where: { user_id, event_id },
    raw: true, // 只需要資料表中資料
  })

  return res.json(event)
})

// --------------------------------------------------------

// POST - 新增一筆活動報名資料
router.post('/', async function (req, res) {
  console.log('接收到的資料:', req.body)
  try {
    const {
      user_id,
      event_id,
      name,
      email,
      phone,
      gender,
      born_date,
      id_number,
      health_status,
      emergency_contact_person,
      emergency_contact_phone,
      notes,
      attendence_status,
    } = req.body

    const newParticipant = await Group_Participant.create({
      user_id: user_id,
      event_id: event_id,
      name: name,
      email: email,
      phone: phone,
      gender: gender, // 預設"保留"
      born_date: born_date,
      id_number: id_number,
      // health_status: JSON.stringify(healthConditions), // 將陣列轉為字串儲存
      health_status: health_status,
      emergency_contact_person: emergency_contact_person,
      emergency_contact_phone: emergency_contact_phone,
      notes: notes,
      attendence_status: attendence_status, // 預設"attended"
    })

    return res
      .status(201)
      .json({ status: 'success', data: { participant: newParticipant } })
  } catch (error) {
    console.error('報名資料儲存失敗:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '報名資料儲存失敗，請稍後再試' })
  }
})

// --------------------------------------------------------

// PUT - 根據 user_id 和 event_id 更新報名狀態
router.put('/user/:user_id/:event_id', async function (req, res) {
  const user_id = Number(req.params.user_id)
  const event_id = Number(req.params.event_id)
  const { attendence_status } = req.body

  try {
    const participant = await Group_Participant.findOne({
      where: { user_id, event_id },
    })

    if (!participant) {
      return res.status(404).json({ status: 'error', message: '參加者未找到' })
    }

    participant.attendence_status =
      attendence_status || participant.attendence_status
    await participant.save()

    return res.json({ status: 'success', data: { participant } })
  } catch (error) {
    console.error('更新資料失敗:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '更新資料失敗，請稍後再試' })
  }
})

// ----------------
export default router
