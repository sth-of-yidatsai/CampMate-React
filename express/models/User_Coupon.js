import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'User_Coupon',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'user', // 參考 user 資料表
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'coupon', // 參考 coupon 資料表
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '未使用', // 設定預設值為 "未使用"
      },
      received_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 領取時間預設為當前時間
      },
      used_at: {
        type: DataTypes.DATE,
        allowNull: true, // 僅當優惠券被使用時才需要填寫
      },
      c_order_id: {
        type: DataTypes.STRING,
        allowNull: true, // 僅當優惠券被使用時才需要填寫
        // references: {
        //   model: 'purchase_order', // 參考 purchase_order 表
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      p_order_id: {
        type: DataTypes.STRING,
        allowNull: true, // 僅當優惠券被使用時才需要填寫
        // references: {
        //   model: 'purchase_order', // 參考 purchase_order 表
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'user_coupon', // 設定資料表名稱
      timestamps: true, // 自動生成 created_at 和 updated_at 欄位
      paranoid: false, // 不使用軟刪除
      underscored: true, // 使用 snake_case 命名欄位
      createdAt: 'created_at', // 對應 created_at 欄位
      updatedAt: 'updated_at', // 對應 updated_at 欄位
    }
  )
}
