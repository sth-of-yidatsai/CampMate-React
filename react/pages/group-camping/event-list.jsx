import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '@/styles/group-camping/event-list.module.scss'
import { useAuthTest } from '@/hooks/use-auth-test'
// general components
import Header from '@/components/template/header'
import Footer from '@/components/template/footer'
import Breadcrumb from '@/components/group-camping/breadcrumb/breadcrumb'
import Pagination from '@/components/pagination/pagination'
import Top_btn from '@/components/tian/common/top_btn'
// page components
import EventCard from '@/components/group-camping/event-list/event-card'
import ModalCreateEvent from '@/components/group-camping/modal/modal-create-event'

// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EventList() {
  // breadcrumb items
  const items = [
    {
      name: 'HOME',
      href: 'http://localhost:3000/home',
    },
    {
      name: 'GROUP',
      href: '',
    },
  ]

  // ------------------------------------------------

  // 活動的狀態
  const [events, setEvents] = useState([])
  // 管理資料載入狀態
  const [isLoading, setIsLoading] = useState(true)
  // 分頁
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEvent = events.slice(startIndex, startIndex + itemsPerPage)

  // 取得活動列表資料
  const getEvents = async () => {
    try {
      const baseURL = 'http://localhost:3005/api/group-event'
      const res = await fetch(baseURL)
      if (!res.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await res.json()
      setEvents(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false) // 資料載入完成或失敗，結束loading
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const titleElement = document.querySelector(`#event-list`)
    // 查元素是否存在
    if (titleElement) {
      window.scrollTo({
        top: document.querySelector(`#event-list`).offsetTop - 88,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  // ------------------------------------------------------

  // 開啟 modal 的函式
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

  // SweetAlert
  const MySwal = withReactContent(Swal)
  const notifyFav = () => {
    MySwal.fire({
      title: '登入會員<br>並建立你的團露吧!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    })
  }

  // 關閉 modal 的函式
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }

  // ------------------------------------------------------

  // 頁面滾動
  const handleScrollToList = () => {
    const section = document.getElementById('event-list')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // -------------------------------------------------------

  return (
    <>
      <Header />

      <section className={`${styles.poster} ${styles.globe}`}>
        <Image
          alt="Group Camping Poster"
          src="/group-camping/poster.jpg"
          layout="fill"
          objectFit="cover"
          priority={true}
        />
        <div className={styles.slogan}>
          <p className={styles.h2Tc}>尋找志同道合的團露夥伴</p>
          <p className={styles.p2Tc}>
            厭倦了城市的繁忙喧囂？想來點不一樣的度假體驗嗎？
            <br />
            那麼就來尋找團露夥伴吧！
          </p>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnPoster} onClick={handleModalOpen}>
            <span class="material-symbols-outlined"> add </span>
            <span className={styles.h6Tc}>建立團露</span>
          </button>
          <button className={styles.btnPoster} onClick={handleScrollToList}>
            <span class="material-symbols-outlined"> grid_view </span>
            <span className={styles.h6Tc}>所有團露</span>
          </button>
        </div>
      </section>

      <main className={`${styles.main} ${styles.globe}`}>
        <div id="event-list" className={styles.title}>
          <Breadcrumb items={items} />
          <p className={`${styles.h5Tc} d-flex align-items-center`}>
            尋找團露夥伴。
            <span className={`${styles.textGray} ${styles.h6Tc}`}>
              看看現在有哪些活動吧。
            </span>
          </p>
        </div>

        <div className={styles.events}>
          <EventCard events={currentEvent} isLoading={isLoading} />
        </div>

        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {isModalOpen && (
        <ModalCreateEvent
          onClose={handleModalClose}
          onEventCreated={getEvents}
        />
      )}

      <Footer />
      <Top_btn />
    </>
  )
}
