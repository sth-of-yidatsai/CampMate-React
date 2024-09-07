import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Price_Relate_Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shop_cart_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'price_relate_order', // 直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
