import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Shop_Info',
    {
      shop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_adress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'shop_info', // 直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
