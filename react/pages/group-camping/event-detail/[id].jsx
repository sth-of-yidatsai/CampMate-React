import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/group-camping/event-detail.module.scss'
import { useAuthTest } from '@/hooks/use-auth-test'
// general components
import Header from '@/components/template/header'
import Footer from '@/components/template/footer'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Top_btn from '@/components/tian/common/top_btn'
// page components
import Info_tab from '@/components/group-camping/event-detail/info_tab'
import LightBox from '@/components/group-camping/lightbox/lightBox'
import ModalJoinEvent from '@/components/group-camping/modal/modal-join-event'
// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EventDetail() {
  // breadcrumb items
  const items = [
    {
      name: 'HOME',
      href: 'http://localhost:3000/home',
    },
    {
      name: 'GROUP',
      href: 'http://localhost:3000/group-camping/event-list',
    },
    {
      name: '團露詳細',
      href: '',
    },
  ]

  // ------------------------------------------------------
  const [event, setEvent] = useState([])
  const router = useRouter()
  const { id } = router.query

  // 取event資料
  const getEvent = async () => {
    if (!id) return // 確保 id 存在

    try {
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
  useEffect(() => {
    if (id) {
      getEvent()
    }
  }, [id])

  // ------------------------------------------------------

  // State for event data and weekdays
  const [weekdays, setWeekdays] = useState({
    join_deadline: '',
    start_date: '',
    end_date: '',
  })

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
        join_deadline: getWeekDay(event[0].join_deadline),
        start_date: getWeekDay(event[0].start_date),
        end_date: getWeekDay(event[0].end_date),
      })
    }
  }, [event])

  // ------------------------------------------------------

  // SweetAlert
  const MySwal = withReactContent(Swal)
  const notifyFav = () => {
    MySwal.fire({
      title: '登入會員才能報名團露哦!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    })
  }
  // 管理 modal 的顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { auth } = useAuthTest()
  // 當按鈕被點擊時觸發的事件處理函式
  const handleModalOpen = () => {
    if (!auth.isAuth) {
      notifyFav()
      return
    }
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
      // 確保元素存在
      const introductionElement = document.getElementById('introduction')
      const locationElement = document.getElementById('location')

      if (introductionElement && locationElement) {
        const introduction = introductionElement.offsetTop
        const location = locationElement.offsetTop
        const scrollPosition = window.scrollY + 150 // 150 是偏移量，根據需要調整

        if (scrollPosition >= introduction && scrollPosition < location) {
          setActiveSection('introduction')
        } else if (scrollPosition >= location) {
          setActiveSection('location')
        }
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
          <main className={`${styles.main} ${styles.globe}`}>
            <Breadcrumb items={items} />
            <div className={styles.details}>
              <LightBox />
              <div className={styles.info}>
                <div className={styles.content}>
                  <div className={styles.title}>
                    <span className={` ${styles.h5Tc}`}>
                      {event[0].event_name}
                    </span>
                  </div>
                  <div className={styles.relatedInfo}>
                    <hr className={styles.headLine} />
                    <div className={styles.infoDetail}>
                      <div className={`${styles.detail} ${styles.location}`}>
                        <span class="material-symbols-outlined">camping</span>
                        <a
                          className={styles.p2Tc}
                          href={`http://localhost:3000/campground/detail?id=${id}`}
                        >
                          {event[0].ground_name}
                        </a>
                      </div>
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
                      <p className={styles.textGray}>
                        {weekdays.join_deadline}
                      </p>
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
                      <p className={styles.textGray}>{weekdays.start_date}</p>
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
                      <p className={styles.textGray}>{weekdays.end_date}</p>
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
          {isModalOpen && (
            <ModalJoinEvent
              onClose={handleModalClose}
              event_id={event[0].event_id} // 傳遞 event_id 給 ModalJoinEvent
            />
          )}
          <Footer />
          <Top_btn />
        </div>
      ) : (
        <p>Loading...</p> // 資料尚未加載時顯示
      )}
    </>
  )
}
