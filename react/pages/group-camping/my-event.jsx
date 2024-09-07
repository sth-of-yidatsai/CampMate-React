import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styles from '@/styles/group-camping/my-event.module.scss'
import { useAuthTest } from '@/hooks/use-auth-test'
// general components
import Header from '@/components/template/header'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Footer from '@/components/template/footer'
import Pagination from '@/components/pagination/pagination'
import MemberSidebar from '@/components/template/member-sidebar'
import Top_btn from '@/components/tian/common/top_btn'
// page components
import ModalCreateEvent from '@/components/group-camping/modal/modal-create-event'
import EventCard from '@/components/group-camping/my-event/event-card'
import ExpandButton from '@/components/expand-button/expand-button-event'

export default function MyEvent() {
  // breadcrumb items
  const items = [
    {
      name: 'HOME',
      href: 'http://localhost:3000/home',
    },
    {
      name: '會員中心',
      href: 'http://localhost:3000/member-test/profile-test',
    },
    {
      name: '我的團露',
      href: 'http://localhost:3000/group-camping/my-event',
    },
  ]

  // ------------------------------------------------------

  // 抓 Auth 裡面的 user 資料 ==> 這邊可以抓到 user 的 id
  const { auth, setAuth } = useAuthTest()
  // const { logoutFirebase } = useFirebase()
  const [userInfo, setUserInfo] = useState([])
  const getUserInfo = async () => {
    const url = `http://localhost:3005/api/users-test/${auth.userData.id}`
    try {
      const response = await fetch(url, {
        credentials: 'include',
      })
      const result = await response.json()

      if (result.status === 'success') {
        console.log(result.data.user)
        setUserInfo([result.data.user])
        fetchData(result.data.user.id) // 直接在這裡調用 fetchData
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false) // 如果出錯，結束 Loading 狀態
    }
  }

  useEffect(() => {
    if (auth.userData && auth.userData.id) {
      getUserInfo()
    }
  }, [auth.userData])

  // ------------------------------------------------------
  // 活動的狀態
  const [events, setEvents] = useState([])
  // 管理資料載入狀態
  const [isLoading, setIsLoading] = useState(true)
  // 分頁
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 4
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEvent = events.slice(startIndex, startIndex + itemsPerPage)

  const fetchData = async (user_id) => {
    try {
      setIsLoading(true) // 開始加載資料
      // 1. 從 group-participant API 取會員報名的活動資料 // 身分為 participant
      const participantResponse = await axios.get(
        `http://localhost:3005/api/group-participant/user/${user_id}`
      )
      // const participantData = participantResponse.data.filter(
      //   (participant) => participant.attendence_status === 'attended'
      // ) // 過濾出 attendance_status 為 'attended' 的資料
      const participantData = participantResponse.data // 移除過濾條件
      console.log('會員的團員資料: ', participantData)

      if (participantData.length === 0) {
        setEvents([]) // 若沒有資料，設置 events 為空陣列
        // return
      }

      // 2. 從 group-organizer API 取會員建立的活動資料 // 身分為 organizer
      const organizerResponse = await axios.get(
        `http://localhost:3005/api/group-organizer/user/${user_id}`
      )
      // const organizerData = organizerResponse.data.filter(
      //   (organizer) => organizer.attendence_status === 'attended'
      // ) // 過濾出 attendance_status 為 'attended' 的資料
      const organizerData = organizerResponse.data // 移除過濾條件
      console.log('會員的團主資料: ', organizerData)

      // 3. 根據 event_id 從 group-event API 取活動詳細資料
      const participantEventPromises = participantData.map((participant) =>
        axios
          .get(
            `http://localhost:3005/api/group-event/${participant.event_id}` // 取活動資料
          )
          .then((response) => ({
            ...response.data[0],
            attendance_status: participant.attendence_status,
            isParticipant: true,
          }))
      )
      console.log(participantEventPromises)

      const organizerEventPromises = organizerData.map((organizer) =>
        axios
          .get(
            `http://localhost:3005/api/group-event/${organizer.organizer_id}` // event_id同organizer_id
          )
          .then((response) => ({ ...response.data[0], isOrganizer: true }))
      )

      // 4. 等待所有請求完成
      const participantEventResponses = await Promise.all(
        participantEventPromises
      )
      console.log(participantEventResponses)

      const organizerEventResponses = await Promise.all(organizerEventPromises)
      console.log(organizerEventResponses)

      // // 5. 合併所有活動資料
      // const organizeEvent = organizerEventResponses.map(
      //   (response) => response.data[0]
      // )
      // // 建立 的活動
      // const participateEvent = participantEventResponses.map(
      //   (response) => response.data[0]
      // )
      // // 報名 的活動
      const eventDetails = [
        // ...organizeEvent.map((event) => ({ ...event, isOrganizer: true })),
        // ...participateEvent.map((event) => ({ ...event, isParticipant: true })),
        ...organizerEventResponses,
        ...participantEventResponses,
      ] // 所有活動

      console.log(eventDetails)

      console.log('會員建立的活動: ', organizerEventResponses)
      console.log('會員報名的活動: ', participantEventResponses)
      console.log('會員所有的活動: ', eventDetails)

      // 6. 更新 state 以顯示活動
      setEvents(eventDetails)
      setTotalPages(Math.ceil(eventDetails.length / itemsPerPage))
      setIsLoading(false)
    } catch (error) {
      console.error('獲取活動資料失敗:', error)
      setEvents([]) // 若獲取資料失敗，設置 events 為空陣列
    } finally {
      setIsLoading(false) // 資料加載完成或發生錯誤後，結束加載
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.querySelector(`.${styles.title}`).offsetTop - 88,
      left: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (userInfo.length > 0) {
      fetchData(userInfo[0].id)
    }
  }, [userInfo])

  // ------------------------------------------------------

  // 使用 useState 來管理 modal 的顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModalOpen = () => {
    setIsModalOpen(true) // 設置 modal 為顯示狀態
  }
  // 關閉 modal 的函式
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }

  // ------------------------------------------------------

  // 控制 ExpandButton 的可見性
  const [isVisible, setIsVisible] = useState(false)
  const couponListTopRef = useRef(null)

  useEffect(() => {
    // 一進入頁面就顯示按鈕
    setIsVisible(true)

    const handleScroll = () => {
      if (couponListTopRef.current) {
        const { top } = couponListTopRef.current.getBoundingClientRect()
        // 當 CouponListTop 滾動進入視窗中間區域時顯示按鈕
        if (top < window.innerHeight && top > 0) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // --------------------------------
  return (
    <>
      <Header />
      <section className={`${styles.main} ${styles.globe}`}>
        {/* <Aside className="sidebarTian" mainLabels={asideLabels} /> */}
        <MemberSidebar />

        <main className={`${styles.pageContent}`}>
          <div className={`${styles.title}`}>
            <Breadcrumb items={items} />
            <p className={`${styles.h5Tc}`}>我的團露。</p>
          </div>
          <ExpandButton isVisible={isVisible} />
          <div className={`${styles.eventList}`}>
            <div className={`${styles.head} ${styles.p1Tc}`}>
              {/* <div className={`${styles.tags}`}>
                <div
                  className={`${styles.tag} ${styles.tagAllEvent} ${styles.active}`}
                >
                  所有團露
                </div>
                <div className={`${styles.tag} ${styles.tagInProgress}`}>
                  進行中
                </div>
                <div className={`${styles.tag} ${styles.tagEnded}`}>已結束</div>
              </div> */}
              <button
                className={`${styles.btnCreate}`}
                onClick={handleModalOpen}
                ariaExpanded="false"
              >
                <span className="material-symbols-outlined">order_approve</span>
                建立團露
              </button>
            </div>
            <>
              {!auth.isAuth ? (
                // 還沒登入時顯示
                <p>
                  請先{' '}
                  <a
                    href="http://localhost:3000/member-test/login"
                    style={{ color: '#e49366' }}
                  >
                    登入
                  </a>{' '}
                  會員
                </p>
              ) : isLoading ? (
                // 如果 isLoading 為 true 顯示 Loading...
                <p>Loading...</p>
              ) : events.length > 0 ? (
                // 有活動資料則顯示資料
                <div ref={couponListTopRef}>
                  <EventCard events={currentEvent} />
                </div>
              ) : (
                // 沒有活動資料時顯示
                <p>
                  目前沒有參加任何團露活動哦
                  <br />
                  前往{' '}
                  <a
                    href="http://localhost:3000/group-camping/event-list"
                    style={{ color: '#e49366' }}
                  >
                    團露列表
                  </a>{' '}
                  報名活動吧!
                </p>
              )}
            </>
            <div className={styles.pagination}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </section>

      {isModalOpen && (
        <ModalCreateEvent
          onClose={handleModalClose}
          onEventCreated={() => fetchData(userInfo[0].id)} // 傳遞 fetchData 函數作為回調
        />
      )}

      <Footer />
      <Top_btn />
    </>
  )
}
