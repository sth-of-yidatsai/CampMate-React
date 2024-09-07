import express from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const {
  Collect_Product,
  Rent_Product,
  Product_Category,
  Product_Relate_Tag,
  Product_Tag,
  Product_Image,
} = sequelize.models

// 商品詳細
Collect_Product.belongsTo(Rent_Product, {
  foreignKey: 'product_id',
})
Rent_Product.hasMany(Collect_Product, {
  foreignKey: 'product_id',
}) // 設置反向關聯

// 圖片
Collect_Product.belongsTo(Product_Image, {
  foreignKey: 'product_id',
})
Product_Image.belongsTo(Collect_Product, {
  foreignKey: 'product_id',
}) // 設置反向關聯

// 詳細串分類
Rent_Product.belongsTo(Product_Category, {
  foreignKey: 'cate_id',
})
Product_Category.hasMany(Rent_Product, {
  foreignKey: 'cate_id',
}) // 設置反向關聯

// Product_Category 自關聯 (parent_id 對應 cate_id)
Product_Category.belongsTo(Product_Category, {
  as: 'ParentCategory',
  foreignKey: 'parent_id',
  targetKey: 'cate_id',
})
Product_Category.hasMany(Product_Category, {
  as: 'SubCategories',
  foreignKey: 'parent_id',
  sourceKey: 'cate_id',
}) // 設置反向關聯

// 詳細串tag_id
Rent_Product.hasMany(Product_Relate_Tag, {
  foreignKey: 'product_id',
})
Product_Relate_Tag.hasMany(Rent_Product, {
  foreignKey: 'product_id',
}) // 設置反向關聯

// tag_id串tag_name
Product_Relate_Tag.belongsTo(Product_Tag, {
  foreignKey: 'tag_id',
})
Product_Tag.hasMany(Product_Relate_Tag, {
  foreignKey: 'tag_id',
})

// tag_id串tag_name並設置自關聯
Product_Tag.belongsTo(Product_Tag, {
  as: 'ParentTag',
  foreignKey: 'parent_id',
})
Product_Tag.hasMany(Product_Tag, {
  as: 'SubTags',
  foreignKey: 'parent_id',
})

// GET - 根據 user_id 獲取所有相關資料
router.get('/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)
    console.log('User ID:', userId)
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user_id' })
    }
    const collectProducts = await Collect_Product.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Rent_Product, // 連結 Rent_Product
          attributes: ['product_name', 'product_description'], // 選擇需要的字段
          include: [
            {
              model: Product_Category, // 連結 Product_Category
              attributes: ['cate_name'], // 選擇需要的字段
              include: [
                {
                  model: Product_Category,
                  as: 'ParentCategory', // 對應到 parent_id 的 category
                  attributes: ['cate_name'], // 對應 parent_id 的 cate_name
                },
              ],
            },
            {
              model: Product_Relate_Tag, // 連結 Product_Tag
              attributes: ['tag_id'], // 選擇需要的字段
              include: [
                {
                  model: Product_Tag, // 連結 Product_Tag
                  attributes: ['tag_name'], // 選擇需要的字段
                  include: [
                    {
                      model: Product_Tag, // 連結 ParentTag
                      as: 'ParentTag', // 關聯的別名
                      attributes: ['tag_name'], // 選擇父標籤的字段
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          model: Product_Image, // 連結 Product_Tag
          attributes: ['image_path'], // 選擇需要的字段
        },
      ],
    })
    if (collectProducts.length === 0) {
      return res.status(404).json({ message: '尚無收藏資料' })
    }
    return res.json({ status: 'success', data: collectProducts })
  } catch (error) {
    console.error('Error fetching collect_campground:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

// GET - 根據 user_id 及 product_id 獲取所有相關資料
router.get('/:user_id/:product_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)
    const productId = Number(req.params.product_id)

    console.log('User ID:', userId)
    console.log('Product ID:', productId)

    if (isNaN(userId) || isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid user_id or product_id' })
    }

    const collectProduct = await Collect_Product.findOne({
      where: { user_id: userId, product_id: productId },
      include: [
        {
          model: Rent_Product, // 連結 Rent_Product
          attributes: ['product_name', 'product_description'], // 選擇需要的字段
          include: [
            {
              model: Product_Category, // 連結 Product_Category
              attributes: ['cate_name'], // 選擇需要的字段
              include: [
                {
                  model: Product_Category,
                  as: 'ParentCategory', // 對應到 parent_id 的 category
                  attributes: ['cate_name'], // 對應 parent_id 的 cate_name
                },
              ],
            },
            {
              model: Product_Relate_Tag, // 連結 Product_Relate_Tag
              attributes: ['tag_id'], // 選擇需要的字段
              include: [
                {
                  model: Product_Tag, // 連結 Product_Tag
                  attributes: ['tag_name'], // 選擇需要的字段
                  include: [
                    {
                      model: Product_Tag, // 連結 ParentTag
                      as: 'ParentTag', // 關聯的別名
                      attributes: ['tag_name'], // 選擇父標籤的字段
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Product_Image, // 連結 Product_Image
          attributes: ['image_path'], // 選擇需要的字段
        },
      ],
    })

    if (!collectProduct) {
      return res.status(404).json({ message: '未找到相關收藏資料' })
    }

    return res.json({ status: 'success', data: collectProduct })
  } catch (error) {
    console.error('Error fetching collect_product:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

// DELETE - 根據 campground_id 刪除收藏資料
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    console.log('Product ID to delete:', id)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid campground_id' })
    }

    // 假設你的關聯設置為刪除時不自動刪除相關數據
    // 如果需要自動刪除相關數據，可以使用 Sequelize 的 `onDelete` 選項
    const result = await Collect_Product.destroy({
      where: { id: id },
    })
    console.log('Delete result:', result)

    if (result === 0) {
      return res.status(404).json({ message: '未找到要刪除的資料' })
    }

    return res.json({ message: '刪除成功' })
  } catch (error) {
    console.error('Error deleting collect_product:', error)
    return res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router
