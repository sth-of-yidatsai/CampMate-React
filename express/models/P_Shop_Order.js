import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'P_Shop_Order',
    {
      order_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
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
        comment: 'line pay',
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pickup_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      create_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'p_shop_order', // 直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
