import React from 'react'

export default function OrderHistory_listCard({
  order,
  campground,
  room,
  check_in_date,
  check_out_date,
  amount,
  people,
  couponName,
}) {
  const startDate = new Date(check_in_date)
  const endDate = new Date(check_out_date)

  // 计算时间差（以毫秒为单位）
  const differenceInTime = endDate.getTime() - startDate.getTime()

  // 将时间差转换为天数
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  return (
    <>
      <div className="listCard">
        <div className="image">
          <div className="imgBox">
            <img src={room.path} alt="" className="imgBox" />
          </div>
        </div>
        <div className="product">
          <div className="productTitle">
            <p className="p2-tc-tian dark-text-tian m-0 productName">
              {room.room_name}
            </p>
            <p className="p2-en-tian dark-text-tian m-0">
              {check_in_date} ~ {check_out_date}
            </p>
          </div>
          <div className="productStyle" style={{ width: '100%' }}>
            <span className="p2-tc-tian sub-text-tian">{room.bed_type}</span>
            {couponName ? (
              <div className="p2-tc-tian sub-text-tian">
                優惠券: {couponName}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="date">
          <span className="p2-en-tian dark-text-tian">
            {check_in_date} ~ {check_out_date}
          </span>
        </div>
        <div className="day">
          <span className="p2-en-tian dark-text-tian">{differenceInDays}</span>
        </div>
        <div className="count">
          <div className="countNum p2-en-tian">{people}</div>
        </div>
        <div className="amount p2-en-tian error-text-tian">
          <span>$</span>
          <span>{amount}</span>
        </div>
      </div>
      <style jsx>{`
        .imgBox {
          object-fit: cover !important;
        }
      `}</style>
    </>
  )
}
