import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './group-card.module.css'
import GroupIcon1 from '@/public/home-icons/groupIcon1.svg'
import GroupIcon2 from '@/public/home-icons/groupIcon2.svg'
import GroupIcon3 from '@/public/home-icons/groupIcon3.svg'
import FavoriteBtn from '@/components/favorite-btn/favorite-btn-ground'
import MapIcon from '@/public/home-icons/mapIcon.svg'

export default function GroupCard({ cardData }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // 確認當前是手機版還是桌面版
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // 初始化檢查

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(timeoutRef.current)
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false)
      }, 3000) // 滑鼠離開3秒後收闔
    }
  }

  const handleCardClick = (e) => {
    if (isMobile && !isExpanded) {
      e.preventDefault()
      setIsExpanded(true)
    }
  }

  // 格式化日期函數
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${parseInt(month)}月${parseInt(day)}日`
  }

  // 將日期轉換為星期幾的函數
  const getWeekday = (dateString) => {
    const date = new Date(dateString)
    const weekdays = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ]
    return weekdays[date.getDay()]
  }

  return (
    <div
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/group-camping/event-detail/${cardData.event_id}`}>
        <div
          className={`${styles.cardBody} ${isExpanded ? styles.expanded : ''}`}
          onClick={handleCardClick}
        >
          <div className={styles.topWrap}>
            <div className={styles.topCard}>
              <div className={styles.info}>
                <Image className={styles.cardIcon2} src={GroupIcon2} alt="" />
                報名截止
              </div>
              <div className={styles.dateWrap}>
                <div className={styles.date}>
                  <span>
                    {formatDate(cardData.join_deadline).split('月')[0]}
                  </span>
                  月
                </div>
                <div className={styles.dLine} />
                <div className={styles.date}>
                  <span>
                    {formatDate(cardData.join_deadline)
                      .split('月')[1]
                      .replace('日', '')}
                  </span>
                  日
                </div>
                <div className={styles.dLine} />
                <div className={styles.verticalText}>
                  {getWeekday(cardData.join_deadline)}
                </div>
              </div>
            </div>
            {isExpanded && (
              <>
                <div className={styles.topCard}>
                  <div className={styles.info}>
                    <Image
                      className={styles.cardIcon}
                      src={GroupIcon2}
                      alt=""
                    />
                    開始日期
                  </div>
                  <div className={styles.dateWrap}>
                    <div className={styles.date}>
                      <span>
                        {formatDate(cardData.start_date).split('月')[0]}
                      </span>
                      月
                    </div>
                    <div className={styles.dLine} />
                    <div className={styles.date}>
                      <span>
                        {formatDate(cardData.start_date)
                          .split('月')[1]
                          .replace('日', '')}
                      </span>
                      日
                    </div>
                    <div className={styles.dLine} />
                    <div className={styles.verticalText}>
                      {getWeekday(cardData.start_date)}
                    </div>
                  </div>
                </div>
                {cardData.end_date && (
                  <div className={styles.topCard}>
                    <div className={styles.info}>
                      <Image
                        className={styles.cardIcon}
                        src={GroupIcon2}
                        alt=""
                      />
                      結束日期
                    </div>
                    <div className={styles.dateWrap}>
                      <div className={styles.date}>
                        <span>
                          {formatDate(cardData.end_date).split('月')[0]}
                        </span>
                        月
                      </div>
                      <div className={styles.dLine} />
                      <div className={styles.date}>
                        <span>
                          {formatDate(cardData.end_date)
                            .split('月')[1]
                            .replace('日', '')}
                        </span>
                        日
                      </div>
                      <div className={styles.dLine} />
                      <div className={styles.verticalText}>
                        {getWeekday(cardData.end_date)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <Image
            className={styles.cardImg}
            layout="fill"
            objectFit="cover"
            src={cardData.images}
            alt={cardData.event_name}
          />
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.cardTitle}>
            <p className={`${isExpanded ? styles.expanded : ''}`}>
              {cardData.event_name}
            </p>
          </div>
          <div className={styles.infoWrap}>
            <div className={styles.info}>
              <Image className={styles.cardIcon} src={GroupIcon3} alt="" />
              {cardData.ground_city}
            </div>
            <div className={styles.info}>
              <Image className={styles.cardIcon} src={GroupIcon1} alt="" />
              人數 {cardData.max_member}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
