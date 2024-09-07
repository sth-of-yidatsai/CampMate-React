import express from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const { Collect_Campground, Campground_Info, Campground_Img } = sequelize.models

// Collect_Campground model
Collect_Campground.belongsTo(Campground_Info, {
  foreignKey: 'campground_id',
  targetKey: 'id',
}) // 將 Collect_Campground 的 campground_id 連結到 Campground_Info 的 id
Campground_Info.hasMany(Collect_Campground, {
  foreignKey: 'campground_id',
  sourceKey: 'id',
}) // 設置反向關聯

// Campground_Img model
Collect_Campground.belongsTo(Campground_Img, {
  foreignKey: 'campground_id',
})
Campground_Img.belongsTo(Collect_Campground, {
  foreignKey: 'campground_id',
})

// GET - 根據 user_id 獲取所有相關資料
router.get('/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user_id' })
    }
    const collectCampgrounds = await Collect_Campground.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Campground_Info, // 連結 Campground_Info
          attributes: [
            'campground_name',
            'area',
            'altitude',
            'campground_introduction',
          ], // 選擇需要的字段
        },
        {
          model: Campground_Img, // 連結 Campground_Img
          attributes: ['path'], // 選擇需要的字段
        },
      ],
    })
    if (collectCampgrounds.length === 0) {
      return res.status(404).json({ message: '尚無收藏資料' })
    }
    return res.json({ status: 'success', data: collectCampgrounds })
  } catch (error) {
    console.error('Error fetching collect_campground:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

// GET - 根據 user_id 及 campground_id 獲取所有相關資料
router.get('/:user_id/:campground_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)
    const campgroundId = Number(req.params.campground_id)

    if (isNaN(userId) || isNaN(campgroundId)) {
      return res
        .status(400)
        .json({ message: 'Invalid user_id or campground_id' })
    }

    const collectCampground = await Collect_Campground.findOne({
      where: { user_id: userId, campground_id: campgroundId },
      include: [
        {
          model: Campground_Info, // 連結 Campground_Info
          attributes: [
            'campground_name',
            'area',
            'altitude',
            'campground_introduction',
          ], // 選擇需要的字段
        },
        {
          model: Campground_Img, // 連結 Campground_Img
          attributes: ['path'], // 選擇需要的字段
        },
      ],
    })

    if (!collectCampground) {
      return res.status(404).json({ message: '未找到相關收藏資料' })
    }

    return res.json({ status: 'success', data: collectCampground })
  } catch (error) {
    console.error('Error fetching collect_campground:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

// DELETE - 根據 campground_id 刪除收藏資料
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    // 假設你的關聯設置為刪除時不自動刪除相關數據
    // 如果需要自動刪除相關數據，可以使用 Sequelize 的 `onDelete` 選項
    const result = await Collect_Campground.destroy({
      where: { id: id },
    })

    if (result === 0) {
      return res.status(404).json({ message: '未找到要刪除的資料' })
    }

    return res.json({ message: '刪除成功' })
  } catch (error) {
    console.error('Error deleting collect_campground:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router
