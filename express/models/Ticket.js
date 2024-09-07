import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Ticket',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      closetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      valid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'ticket', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'createtime', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
