import React, { useRef, useState, useEffect } from 'react'
import styles from './home-group-area.module.css'
import GroupCard from '@/components/home-group-card/group-card'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

export default function HomeGroupArea() {
  const listRef = useRef()
  const [groupCardsData, setGroupCardsData] = useState([]) // 用於儲存從後端獲取的數據
  const [error, setError] = useState(null)

  const scroll = (direction) => {
    const { current } = listRef
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' })
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const fetchGroupEvents = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/group-event') // API 端點
        const data = await response.json()

        if (!response.ok) {
          throw new Error('Failed to fetch group events')
        }

        // 更新狀態以保存從後端獲取的數據
        setGroupCardsData(data)
      } catch (error) {
        console.error('Error fetching group events:', error)
        setError('無法加載活動資料，請稍後再試。')
      }
    }

    fetchGroupEvents()
  }, []) // 空依賴數組表示這個 effect 只在初次渲染時運行

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <span className={styles.h2}>熱門團露推薦。</span>
          現在就來看看有哪些活動。
        </h2>
      </div>
      <div className={styles.containerW100}>
        <div className={styles.wrapper}>
          <MdChevronLeft
            className={`${styles.arrow} ${styles.left}`}
            onClick={() => scroll('left')}
          />
          <div className={styles.mask}>
            <div className={styles.cardList} ref={listRef}>
              <div className={styles.cards}>
                {groupCardsData.map((card, index) => (
                  <div
                    key={card.event_id}
                    className={
                      index === 0
                        ? styles.firstCard
                        : index === groupCardsData.length - 1
                        ? styles.lastCard
                        : ''
                    }
                  >
                    <GroupCard cardData={card} />
                  </div>
                ))}
              </div>
            </div>
            <MdChevronRight
              className={`${styles.arrow} ${styles.right}`}
              onClick={() => scroll('right')}
            />
          </div>
        </div>
      </div>
    </>
  )
}
