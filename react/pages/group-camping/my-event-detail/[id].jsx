import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '@/styles/group-camping/my-event-detail.module.scss'
import { useAuthTest } from '@/hooks/use-auth-test'
import axios from 'axios'
// general components
import Header from '@/components/template/header'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Footer from '@/components/template/footer'
import MemberSidebar from '@/components/template/member-sidebar'
import Top_btn from '@/components/tian/common/top_btn'
// page components
import ModalCancelEvent from '@/components/group-camping/modal/modal-cancel-event'

export default function MyEventDetail() {
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
    {
      name: '團露詳情',
      href: '',
    },
  ]

  // ------------------------------------------------------

  // 抓 Auth 裡面的 user 資料 ==> 這邊可以抓到 user 的 id
  const { auth, setAuth } = useAuthTest()
  console.log(auth.userData)

  // ------------------------------------

  const [event, setEvent] = useState([])
  const [loading, setLoading] = useState(true)
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
      setLoading(false) // 資料載入完畢
    } catch (error) {
      console.error('Failed to fetch event:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (id) {
      getEvent(id)
    }
  }, [id])

  // ------------------------------------------------------

  const [organizer, setOrganizer] = useState([])
  const [participants, setParticipants] = useState([])

  const getOrganizerAndParticipants = async (eventId) => {
    try {
      // 獲取團主資料
      const organizerRes = await axios.get(
        `http://localhost:3005/api/group-organizer/${eventId}`
      )
      // const organizerData = organizerRes.data.filter(
      //   (organizer) => organizer.attendence_status === 'attended'
      // ) // 過濾出 attendance_status 為 'attended' 的資料
      console.log(organizerRes.data)
      // console.log(organizerData)
      setOrganizer(organizerRes.data)

      // 獲取團員資料
      const participantsRes = await axios.get(
        `http://localhost:3005/api/group-participant/event/${eventId}`
      )
      const participantData = participantsRes.data.filter(
        (participant) => participant.attendence_status === 'attended'
      ) // 過濾出 attendance_status 為 'attended' 的資料
      console.log(participantsRes.data)
      console.log('團員資料: ', participantData) // 過濾出attended的團員

      // setParticipants(participantsRes.data)
      setParticipants(participantData)
    } catch (error) {
      console.error('Failed to fetch organizer or participants:', error)
    }
  }

  useEffect(() => {
    if (id) {
      getEvent(id)
      getOrganizerAndParticipants(id) // 在獲取 event 資料後獲取團主和團員資料
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

    return weekDays[weekDay] // 轉為文字字串
  }

  useEffect(() => {
    if (event.length > 0) {
      console.log(event[0].event_name) // 這裡確保資料已經存在後再執行
      setWeekdays({
        join_deadline: getWeekDay(event[0].join_deadline),
        start_date: getWeekDay(event[0].start_date),
        end_date: getWeekDay(event[0].end_date),
      })
    }
  }, [event])

  // ------------------------------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModalOpen = () => {
    setIsModalOpen(true) // 設置 modal 為顯示狀態
  }
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }

  // ------------------------------------------------------

  // 在渲染之前檢查 loading 狀態和 event 是否已經存在
  if (loading) {
    return <p>Loading...</p>
  }

  if (!event) {
    return <p>No event data available</p>
  }

  // ------------------------------------------------------

  return (
    <>
      {event && event.length > 0 ? ( // 檢查是否有資料
        <div className={styles.globe}>
          <Header />
          <section className={`${styles.main} ${styles.globe}`}>
            <MemberSidebar />

            <div className={styles.pageContent}>
              <div className={styles.title}>
                <Breadcrumb items={items} />
                <p className={styles.h5Tc}>團露詳情。</p>
              </div>
              <div className={styles.eventDetail}>
                <div className={styles.intro}>
                  <div className={styles.cardInfo}>
                    <Image
                      className={styles.cardImage}
                      src="/group-camping/event_card.jpg"
                      alt="Group Camping Event Image"
                      width={250}
                      height={0}
                      layout="intrinsic"
                      objectFit="cover"
                    />
                    <div className={styles.cardContent}>
                      <span className={`${styles.title} ${styles.h6Tc} mb-3`}>
                        {event[0].event_name}
                      </span>
                      <div className={`${styles.groundInfo} ${styles.p2Tc}`}>
                        <span class="material-symbols-outlined">camping</span>
                        <a
                          className={`${styles.title}`}
                          href={`http://localhost:3000/campground/detail?id=${id}`}
                        >
                          {event[0].ground_name}
                        </a>
                      </div>
                      <div className={`${styles.groundInfo} ${styles.p2Tc}`}>
                        <span class="material-symbols-outlined">
                          location_on
                        </span>
                        <p className={`${styles.title}`}>
                          {event[0].ground_city}
                        </p>
                      </div>
                    </div>
                    {/* <p className={`${styles.title} ${styles.h6Tc}`}>
                      {event[0].event_name}
                    </p> */}
                  </div>
                  <div className={styles.eventDate}>
                    <div className={`${styles.date} ${styles.dateStart}`}>
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
                    <div className={`${styles.date} ${styles.dateEnd}`}>
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
                <div className={`${styles.detail} ${styles.description}`}>
                  <p className={styles.h6Tc}>團露介紹</p>
                  <hr />
                  <p className={styles.p1Tc}>{event[0].event_description}</p>
                </div>
                <div className={`${styles.detail} ${styles.location}`}>
                  <p className={`${styles.title} ${styles.h6Tc}`}>地點</p>
                  <hr />
                  <p className={styles.text}>
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
                      width="952"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="showing the location of the event in Google Maps"
                    ></iframe>
                  </div>
                </div>
                <div className={`${styles.detail} ${styles.memberList}`}>
                  <p className={styles.h6Tc}>參加名單</p>
                  <hr />
                  <div className={styles.memberBottom}>
                    <div className={styles.members}>
                      <div
                        className={`${styles.member} ${styles.organizer} ${styles.h6Tc}`}
                      >
                        <div className={`${styles.tag} ${styles.tagOrganizer}`}>
                          團主
                        </div>
                        <div className={styles.participant}>
                          {/* 宋庭毓 */}
                          {organizer ? organizer.name : 'Loading...'}
                        </div>
                      </div>
                      <div
                        className={`${styles.member} ${styles.participants} ${styles.h6Tc}`}
                      >
                        <div
                          className={`${styles.tag} ${styles.tagParticipant}`}
                        >
                          團員
                        </div>
                        <div className={styles.participant}>
                          {/* 簡珩宇 | 陳哲偉 | 蔡易達 | 賴聖儒 | 田承鎬 */}
                          {participants.length > 0
                            ? participants.map((p) => p.name).join(' | ')
                            : '目前還沒有人報名哦!'}
                        </div>
                      </div>
                    </div>
                    <button
                      className={styles.btnCancel}
                      onClick={handleModalOpen}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      <span className={styles.p2Tc}>退出團露</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isModalOpen && (
            <ModalCancelEvent
              onClose={handleModalClose}
              user_id={auth.userData.id} // 傳遞當前用戶的 id
              event_id={event[0].event_id} // 傳遞當前活動的 id
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
