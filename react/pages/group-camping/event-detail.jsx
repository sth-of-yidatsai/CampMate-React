import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '@/styles/group-camping/event-detail.module.scss'
// components
import Header from '@/components/template/header'
import Footer from '@/components/template/footer'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Info_tab from '@/components/group-camping/event-detail/info_tab'
import LightBox from '@/components/group-camping/lightbox/lightBox'
import ModalJoinEvent from '@/components/group-camping/modal/modal-join-event'

export default function EventDetail() {
  const router = useRouter()
  const { id } = router.query

  //  ------------------------------

  // breadcrumb items
  const items = [
    {
      name: 'HOME',
      href: '#',
    },
    {
      name: 'GROUP',
      href: '#',
    },
    {
      name: '團露詳細',
      href: '#',
    },
  ]

  // ------------------------------------------------------

  // State for event data and weekdays
  const [event, setEvent] = useState([])
  const [weekdays, setWeekdays] = useState({
    joinDeadline: '',
    startDate: '',
    endDate: '',
  })

  // 取event資料
  const getEvent = async () => {
    if (!id) return // 確保 id 存在

    try {
      // const baseURL = 'http://localhost:3005/api/group-event/'
      const baseURL = `http://localhost:3005/api/group-event/${id}`
      const res = await fetch(baseURL)

      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await res.json()
      console.log(data)
      // console.log(data.event)
      // setEvent(data.event)
      setEvent(data)
    } catch (error) {
      console.error('Failed to fetch event:', error)
    }
  }
  // useEffect(() => {
  //   getEvent()
  // }, [])
  useEffect(() => {
    if (id) {
      getEvent(id)
    }
  }, [id])

  // Calculate weekday based on date string
  const getWeekDay = (dateString) => {
    const date = new Date(dateString)
    const weekDay = date.getDay() // 取得星期幾, 0為星期日, 6為星期六
    const weekDays = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ]
    // 轉為文字字串
    return weekDays[weekDay]
  }

  useEffect(() => {
    if (event.length > 0) {
      setWeekdays({
        joinDeadline: getWeekDay(event[0].join_deadline),
        startDate: getWeekDay(event[0].start_date),
        endDate: getWeekDay(event[0].end_date),
      })
    }
  }, [event])

  // ------------------------------------------------------

  // 管理 modal 的顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 當按鈕被點擊時觸發的事件處理函式
  const handleModalOpen = () => {
    console.log('btnJoin clicked! open modal.')
    setIsModalOpen(true) // 設置 modal 為顯示狀態
  }
  // 關閉 modal 的函式
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }

  // ------------------------------------------------------

  // 控制商品資訊導覽標籤的點選與否
  const [activeSection, setActiveSection] = useState('introduction')

  useEffect(() => {
    const handleScroll = () => {
      const introduction = document.getElementById('introduction').offsetTop
      const location = document.getElementById('location').offsetTop
      const scrollPosition = window.scrollY + 150 // 150 是偏移量，根據需要調整

      if (scrollPosition >= introduction && scrollPosition < location) {
        setActiveSection('introduction')
      } else if (scrollPosition >= location) {
        setActiveSection('location')
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // State to manage carousel image index
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Ref to the carousel container
  const carouselRef = useRef(null)

  // Images array
  const images = [
    '/group-camping/event_card_2.jpg',
    '/group-camping/event_card_2.jpg',
    '/group-camping/event_card_2.jpg',
    '/group-camping/event_card_2.jpg',
  ]

  // Function to handle carousel navigation
  const handleCarouselNav = (direction) => {
    setCarouselIndex((prevIndex) => {
      const newIndex = (prevIndex + direction + images.length) % images.length
      return newIndex
    })
  }

  return (
    <>
      {event && event.length > 0 ? ( // 檢查是否有資料
        <div className={styles.globe}>
          <Header />
          <main className={styles.main}>
            <Breadcrumb items={items} />
            <div className={styles.details}>
              <LightBox />
              <div className={styles.info}>
                <div className={styles.content}>
                  <div className={styles.title}>
                    <a
                      href="http://localhost:3000/campground/detail?id=1"
                      className={`${styles.toGround} ${styles.h5Tc}`}
                    >
                      {event[0].event_name}
                    </a>
                  </div>
                  <div className={styles.relatedInfo}>
                    <hr className={styles.headLine} />
                    <div className={styles.infoDetail}>
                      <div className={`${styles.detail} ${styles.location}`}>
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                        <span className={styles.p2Tc}>
                          {event[0].ground_city}
                        </span>
                      </div>
                      <div className={`${styles.detail} ${styles.date}`}>
                        <span className="material-symbols-outlined">
                          calendar_today
                        </span>
                        <span className={styles.p2En}>
                          {event[0].start_date} to {event[0].end_date}
                        </span>
                      </div>
                      <div className={`${styles.detail} ${styles.num}`}>
                        <span className="material-symbols-outlined">
                          person
                        </span>
                        <span className={styles.p2Tc}>人數</span>
                        <span className={styles.p2En}>
                          1 / {event[0].max_member}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.dates}>
                    <div className={styles.deadline}>
                      <p className={styles.textHint}>報名截止</p>
                      <p className={styles.h3En}>
                        {event[0].join_deadline.slice(8, 10)}
                      </p>
                      <p className={styles.textGray}>
                        {event[0].join_deadline.slice(5, 7)}月
                      </p>
                      <p className={styles.textGray}>{weekdays.joinDeadline}</p>
                    </div>
                    <hr />
                    <div className={styles.dateStart}>
                      <p className={styles.textGray}>開始日期</p>
                      <p className={styles.h3En}>
                        {event[0].start_date.slice(8, 10)}
                      </p>
                      <p className={styles.textGray}>
                        {event[0].start_date.slice(5, 7)}月
                      </p>
                      <p className={styles.textGray}>{weekdays.startDate}</p>
                    </div>
                    <hr />
                    <div className={styles.dateEnd}>
                      <p className={styles.textGray}>結束日期</p>
                      <p className={styles.h3En}>
                        {event[0].end_date.slice(8, 10)}
                      </p>
                      <p className={styles.textGray}>
                        {event[0].end_date.slice(5, 7)}月
                      </p>
                      <p className={styles.textGray}>{weekdays.endDate}</p>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.btnJoin}
                  onClick={handleModalOpen}
                  aria-expanded="false"
                >
                  <span className="material-symbols-outlined">
                    order_approve
                  </span>
                  <span className={styles.p2Tc}>報名團露</span>
                </button>
              </div>
            </div>
            <div className={styles.description}>
              <Info_tab activeSection={activeSection} />
              <div className={styles.contents}>
                <div
                  className={`${styles.content} ${styles.introduction}`}
                  id="introduction"
                >
                  <p className={`${styles.title} ${styles.h6Tc}`}>團露介紹</p>
                  <hr />
                  <p className={`${styles.text} ${styles.p1Tc}`}>
                    {/* 早期眠月線的開發是日本政府為了運送山下砍伐的巨木而建造，後為了發展觀光，在民國72年時開始使用古老的蒸汽火車載客，當時在國內外，都造成了鐵路迷的大轟動。而眠月線是阿里山鐵道支線之一，起於阿里山新站，止於石猴站，全長「9.2公里」，沿途共經過「24個橋樑與12個隧道」
                    <br />
                    <br />
                    1999年因為921大地震，鐵路坍方而停駛，而後經過一番修復曾經短暫恢復通車，不料2008年又遭遇八八風災再度損毀，至今未再復駛。因為沿途的景色優美，且擁有森林、鐵道、車站、高空鐵橋等多重景觀，且坡度平緩，行走難度平易近人，如今已經成為了深受遊客喜愛的健走路線 */}
                    {event[0].event_description}
                  </p>
                </div>
                <div
                  className={`${styles.content} ${styles.location}`}
                  id="location"
                >
                  <p className={`${styles.title} ${styles.h6Tc}`}>地點</p>
                  <hr />
                  <p className={`${styles.text} ${styles.p1Tc}`}>
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    {event[0].address}
                    <a
                      href={`https://www.google.com.tw/maps/search/${event[0].address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看地圖
                    </a>
                  </p>
                  <div id="map">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58562.08523458192!2d120.47676484863281!3d23.455762999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346eeb1d9bc8a33d%3A0x270da370891e6d8b!2z5q245qi45qOu5rS76Zyy54ef5Y2A!5e0!3m2!1szh-TW!2stw!4v1724593021555!5m2!1szh-TW!2stw`}
                      width="844"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="showing the location of the event in Google Maps"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {isModalOpen && <ModalJoinEvent onClose={handleModalClose} />}
          <Footer />
        </div>
      ) : (
        <p>Loading...</p> // 資料尚未加載時顯示
      )}
    </>
  )
}
