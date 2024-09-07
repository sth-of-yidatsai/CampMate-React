import React, { createContext, useState, useContext, useEffect } from 'react'

const rentCalendarContext = createContext(null)

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份從 0 開始，需要 +1
  const day = date.getDate()

  // 格式化日期，僅在需要時添加前導零
  const monthFormatted = month < 10 ? month : month
  const dayFormatted = day < 10 ? day : day

  return `${year}-${monthFormatted}-${dayFormatted}`
}

export default function rentCalendarProvider() {
  // ## 日曆相關
  // 獲取今天的日期
  const today = new Date()
  const todayFormatted = formatDate(today)

  // 獲取明天的日期
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowFormatted = formatDate(tomorrow)

  const [calenderValue, setCalenderValue] = useState(
    '選擇日期'
    // todayFormatted + '~' + tomorrowFormatted
  )
  // 設定開始日起 以及 結束日期
  const [startDateStr, endDateStr] = calenderValue.split('~')

  // 创建 Date 对象
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  // 计算时间差（毫秒）
  let timeDifference
  if (isNaN((endDate - startDate) / (1000 * 60 * 60 * 24))) {
    timeDifference = 1
  } else {
    timeDifference = (endDate - startDate) / (1000 * 60 * 60 * 24)
  }

  return (
    <rentCalendarContext.Provider
      value={{
        calenderValue,
        setCalenderValue,
      }}
    >
      {children}
    </rentCalendarContext.Provider>
  )
}

export const useRentCalendar = () => useContext(rentCalendarContext)
