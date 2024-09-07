import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Group_event',
    {
      event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      organizer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      max_member: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      join_deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      ground_order_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ground_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ground_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ground_city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ground_altitude: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ground_geolocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      images: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/campground/title1.webp',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '即將到來',
      },
    },
    {
      tableName: 'group_event', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
