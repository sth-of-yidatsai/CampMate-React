import { useState } from 'react'
import { useQuery } from '@/hooks/use-query'
import styles from './homeInputBar2.module.scss'
import { IoSearchSharp } from 'react-icons/io5'
import { RiTentLine } from 'react-icons/ri'

export default function HomeInputBar3() {
  const {
    filters,
    setFilters,
    updateFilters,
    priceGte,
    setPriceGte,
    priceLte,
    setPriceLte,
    toggleFiltersArr,
    updateFiltersObj,
    toggleFiltersObjArr,
    resetFilters,
    liveTag,
    setLiveTag,
    livePrice,
    setLivePrice,
    originSort,
    setOriginSort,
    goToList,
  } = useQuery()

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

  return (
    <>
      <div className={styles.groupWrapper}>
        <div className={`${styles.blockWrapper} ${styles.mobiShow}`}>
          <div className={styles.inputWrapper}>
            <RiTentLine className={styles.lableIcon} />
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
        </div>
        <div className={styles.iconWrapper}>
          {/* <!-- 開始搜尋的按鈕 --> */}
          <button className={styles.searchBtn} onClick={searching}>
            <IoSearchSharp className={styles.lableIcon} />
          </button>
        </div>
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
            font-size: 16px;
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
