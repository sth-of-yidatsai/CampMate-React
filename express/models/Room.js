import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Room',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      campground_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bed_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      room_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refund: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      food: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      internet: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      parking_lot: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      valid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'room', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
