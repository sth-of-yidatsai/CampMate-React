import React, { useRef, useEffect, useState } from 'react'
import styles from './home-groundcard-area.module.css'
import GroundCard01 from '@/components/home-ground-card/ground-card01'
import GroundCard02 from '@/components/home-ground-card/ground-card02'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

export default function HomeGroundcardArea() {
  const listRef = useRef()
  const [groundsData, setGroundsData] = useState([])

  const groundIds = [1, 2, 3, 4, 5, 6, 7, 8] // 指定的露營地ID

  const [eachComment, setEachComment] = useState([]) // 每筆的評論數

  useEffect(() => {
    async function fetchGrounds() {
      try {
        const response = await fetch(
          `http://localhost:3005/api/home/campground?ids=${groundIds.join(',')}`
        )
        const data = await response.json()

        if (data.status === 'success') {
          setGroundsData(data.ground_data)
          setEachComment(data.data.eachComment)
        } else {
          console.error('Failed to fetch grounds:', data.msg)
        }
      } catch (error) {
        console.error('Error fetching grounds:', error)
      }
    }

    fetchGrounds()
  }, [])

  const scroll = (direction) => {
    const { current } = listRef
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' })
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <span className={styles.h2}>全台熱門露營區推薦。</span>
          現在就來看看有哪些露營地。
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
                {groundsData[0] && (
                  <div className={styles.firstCard}>
                    <GroundCard01
                      camp={groundsData[0]}
                      eachComment={eachComment}
                      rooms={groundsData[0].rooms}
                    />
                  </div>
                )}
                {groundsData[1] && (
                  <div>
                    <GroundCard02
                      camp={groundsData[1]}
                      eachComment={eachComment}
                      rooms={groundsData[1].rooms}
                    />
                  </div>
                )}
                {groundsData[2] && (
                  <div>
                    <GroundCard01
                      camp={groundsData[2]}
                      eachComment={eachComment}
                      rooms={groundsData[2].rooms}
                    />
                  </div>
                )}
                {groundsData[3] && (
                  <div className={styles.lastCard}>
                    <GroundCard02
                      camp={groundsData[3]}
                      eachComment={eachComment}
                      rooms={groundsData[3].rooms}
                    />
                  </div>
                )}
              </div>
              <div className={styles.cards}>
                {groundsData[4] && (
                  <div className={styles.firstCard}>
                    <GroundCard02
                      camp={groundsData[4]}
                      eachComment={eachComment}
                      rooms={groundsData[4].rooms}
                    />
                  </div>
                )}
                {groundsData[5] && (
                  <div>
                    <GroundCard01
                      camp={groundsData[5]}
                      eachComment={eachComment}
                      rooms={groundsData[5].rooms}
                    />
                  </div>
                )}
                {groundsData[6] && (
                  <div>
                    <GroundCard02
                      camp={groundsData[6]}
                      eachComment={eachComment}
                      rooms={groundsData[6].rooms}
                    />
                  </div>
                )}
                {groundsData[7] && (
                  <div className={styles.lastCard}>
                    <GroundCard01
                      camp={groundsData[7]}
                      eachComment={eachComment}
                      rooms={groundsData[7].rooms}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <MdChevronRight
            className={`${styles.arrow} ${styles.right}`}
            onClick={() => scroll('right')}
          />
        </div>
      </div>
    </>
  )
}
