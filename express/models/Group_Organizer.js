import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Group_Organizer',
    {
      organizer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '保留',
      },
      born_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      health_status: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emergency_contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergency_contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attendence_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'attended', // 預設值
      },
    },
    {
      tableName: 'group_organizer', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
