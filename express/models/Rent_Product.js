import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Rent_Product',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_brief: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_specification: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      create_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      main_img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_valid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'rent_product', // 直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
