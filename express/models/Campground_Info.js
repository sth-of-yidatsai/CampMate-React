import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Campground_Info',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      campground_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title_img_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      campground_introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      restriction: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      altitude: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      geolocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      campground_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'campground_info', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
