import { Sequelize, DataTypes } from 'sequelize'
import { nanoid } from 'nanoid'

export default async function (sequelize) {
  return sequelize.define(
    'C_Order',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        comment: 'UUID',
      },
      campground_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      check_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      people: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'LINE Pay, 信用卡, ATM',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'pending, paid, fail, cancel, error',
      },
      order_info: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'send to line pay',
      },
      reservation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'get from line pay',
      },
      confirm: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'confirm from line pay',
      },
      return_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_number: {
        type: DataTypes.UUID,
        defaultValue: () => nanoid(10),
        allowNull: false,
        unique: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'c_order', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
