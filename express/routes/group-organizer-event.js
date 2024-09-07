// 在你的主要路由文件中
import express from 'express'
import sequelize from '#configs/db.js'

const router = express.Router()
const { Group_event, Group_Organizer } = sequelize.models

// POST - 同時新增 Organizer 和 Event
// router.post('/group-organizer-event', async (req, res) => {
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const {
      // Organizer Data
      user_id,
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

      // Event Data
      event_name,
      event_description,
      max_member,
      start_date,
      end_date,
      join_deadline,
      ground_order_number,
      ground_name,
      ground_phone,
      ground_city,
      address,
      ground_altitude,
      ground_geolocation,
      images,
      status,
    } = req.body

    // 1. 創建 Organizer
    const newOrganizer = await Group_Organizer.create(
      {
        user_id: user_id,
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        born_date: born_date,
        id_number: id_number,
        health_status: health_status,
        emergency_contact_person: emergency_contact_person,
        emergency_contact_phone: emergency_contact_phone,
        notes: notes,
      },
      { transaction }
    )

    // 2. 使用同一個 ID 創建 Event
    const newEvent = await Group_event.create(
      {
        organizer_id: newOrganizer.organizer_id,
        // organizer_id: 2,
        event_name: event_name,
        event_description: event_description,
        max_member: max_member,
        start_date: start_date,
        end_date: end_date,
        join_deadline: join_deadline,
        ground_order_number: ground_order_number,
        ground_name: ground_name,
        ground_phone: ground_phone,
        ground_city: ground_city,
        address: address,
        ground_altitude: ground_altitude,
        ground_geolocation: ground_geolocation,
        images: images,
        status: status,
      },
      { transaction }
    )

    // 3. 提交事務
    await transaction.commit()

    return res.status(201).json({
      status: 'success',
      data: { organizer: newOrganizer, event: newEvent },
    })
  } catch (error) {
    // 如果有錯誤，回滾事務
    await transaction.rollback()
    console.error('建立資料儲存失敗:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '建立資料儲存失敗，請稍後再試' })
  }
})

export default router
