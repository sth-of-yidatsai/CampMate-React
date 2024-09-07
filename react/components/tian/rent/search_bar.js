import { useState, useEffect, useRef } from 'react'

import { useQuery } from '@/hooks/use-query'
import { useRentCalendar } from '@/hooks/use-calendar'

import styles from './search_bar.module.scss'
import Calendar from './calender'
import { ClientPageRoot } from 'next/dist/client/components/client-page'

export default function Search_Bar() {
  const {
    calenderValue,
    setCalenderValue,
    updateFilters,
    setPriceGte,
    setPriceLte,
    resetFilters,
    setLiveTag,
    setLivePrice,
    setOriginSort,
    goToList,
  } = useQuery()

  // For Calender
  const [isopenCalender, setIsOpenCalender] = useState(false)
  const toggleCalender = () => setIsOpenCalender(!isopenCalender)
  const openCalender = () => setIsOpenCalender(true)
  const closeCalender = () => setIsOpenCalender(false)

  const calenderRef = useRef(null)
  const triggerRef = useRef(null)

  // 儲存時實的搜尋關鍵字(隨時準備存入filters)
  const [liveKeyword, setLiveKeyword] = useState('')

  // 執行搜尋
  const searching = () => {
    resetFilters()
    setLivePrice([])
    setLiveTag({
      brand: [],
      people: [],
      functional: [],
      material: [],
      price: [],
    })
    setOriginSort('none')
    setPriceGte(0)
    setPriceLte(2500)
    updateFilters('keyword', liveKeyword)
    goToList()
  }

  // 判斷按下的是否是enter 如果是
  const handleEnter = (e) => {
    e.stopPropagation()
    if (e.key && e.key === 'Enter') {
      searching()
      return
    }
  }

  // 從search_bar獲取關鍵字(應用在onChange上) 這邊每次變化就會設定一次
  const handleKeywordChange = (e) => {
    // 確認搜尋欄是有輸入內容的 沒有就給searchValue一個空值
    if (e.target.value === '' || !e.target.value) {
      setLiveKeyword('')
      return
    }
    // 將搜尋欄的內容 設定進狀態(要放進queryUrl送去後端做搜尋)
    setLiveKeyword(e.target.value)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 檢測點擊是否在視窗外
      if (
        calenderRef.current &&
        !calenderRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        closeCalender()
      }
    }

    if (isopenCalender) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // 清除事件監聽
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isopenCalender])

  return (
    <>
      <div className={styles.groupWrapper}>
        {/* <!-- ↓↓↓↓ 月曆的 時段輸入 ↓↓↓↓ --> */}
        <div
          className={styles.blockWrapper}
          ref={triggerRef}
          onClick={() => {
            toggleCalender()
          }}
        >
          <div className={`${styles.inputWrapper}`}>
            <button className={`${styles.entryArea}  p2-tc-tian`}>
              {calenderValue}
            </button>
          </div>
          <div className={styles.iconWrapper}>
            <span className="material-symbols-outlined light-text-tian">
              date_range
            </span>
          </div>
        </div>
        {/* <!-- ↑↑↑↑ 月曆的 時段輸入 ↑↑↑↑ --> */}

        {/* <!-- ↓↓↓↓ 關鍵字的 搜尋輸入 ↓↓↓↓ --> */}
        <div className={styles.blockWrapper}>
          <div className={styles.inputWrapper}>
            <input
              className={`${styles.entryArea} p2-tc-tian`}
              type="text"
              name="keyword"
              value={liveKeyword}
              onChange={handleKeywordChange}
              onKeyDown={handleEnter}
              placeholder="今天要找什麼呢？"
            />
          </div>
          <div className={styles.iconWrapper}>
            {/* <!-- ↓↓↓↓ 開始搜尋的按鈕 ↓↓↓↓ --> */}
            <button className={styles.searchWrapper} onClick={searching}>
              <span className="material-symbols-outlined light-text-tian">
                search
              </span>
            </button>
          </div>
        </div>
        {/* <!-- ↑↑↑↑ 關鍵字的 搜尋輸入 ↑↑↑↑ --> */}

        {/* <!-- ↓↓↓↓ 月曆的彈出式視窗 ↓↓↓↓ --> */}
        <div className={styles.calenderWrapper}>
          <div
            ref={calenderRef}
            className={
              isopenCalender
                ? `${styles.calender} ${styles.open}`
                : `${styles.calender}`
            }
          >
            {/* <!-- ↓↓↓↓ 月曆的組件 ↓↓↓↓ --> */}
            <Calendar />
          </div>
        </div>
        {/* <!-- ↑↑↑↑ 月曆的彈出式視窗 ↑↑↑↑ --> */}
      </div>

      <style jsx>
        {`
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .wrapper {
            background: var(--sub-color);
            width: 300px;
            height: 180px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            justify-content: space-between;
          }
          .title {
            font-family: 'Noto Sans TC';
            font-size: 16x;
            font-style: normal;
            font-weight: 700;
            padding-bottom: 10px;
          }
          .btn-wrapper {
            display: flex;
            justify-content: center;
          }
          .compBtn {
            background: var(--main-color-dark);
            padding: 5px;
            width: 150px;
            border-radius: 5px;
            color: var(--main-color-bright);
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            border: none;
          }

          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          }
        `}
      </style>
    </>
  )
}
