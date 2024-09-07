import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/group-camping/my-event-detail.module.scss'
// general components
import Header from '@/components/template/header'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Aside from '@/components/template/sidebar'
import Footer from '@/components/template/footer'
import MemberSidebar from '@/components/template/member-sidebar'
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
  // aside 標籤
  const asideLabels = [
    {
      title: '帳戶資訊',
      icon: (
        <>
          <span class="material-symbols-outlined">person</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '收藏清單',
      icon: (
        <>
          <span class="material-symbols-outlined">favorite</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '訂單紀錄',
      icon: (
        <>
          <span class="material-symbols-outlined">shopping_basket</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '團露紀錄',
      icon: (
        <>
          <span class="material-symbols-outlined">groups</span>
        </>
      ),
      subLabel: ['我的團露'],
    },
    {
      title: '優惠券',
      icon: (
        <>
          <span class="material-symbols-outlined">confirmation_number</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '客服中心',
      icon: (
        <>
          <span class="material-symbols-outlined">chat</span>
        </>
      ),
      subLabel: ['小分類'],
    },
  ]
  // ------------------------------------------------------
  // vvvvv  modal create event  vvvvv
  // 使用 useState 來管理 modal 的顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 當按鈕被點擊時觸發的事件處理函式
  const handleModalOpen = () => {
    console.log('btnCancel clicked! open modal.')
    setIsModalOpen(true) // 設置 modal 為顯示狀態
  }
  // 關閉 modal 的函式
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }
  // ^^^^^  modal create event  ^^^^^
  // ------------------------------------------------------
  return (
    <>
      <Header />
      <section className={`${styles.main} ${styles.globe}`}>
        {/* <Aside className="sidebarTian" mainLabels={asideLabels} /> */}
        <MemberSidebar />

        <div className={styles.pageContent}>
          <div className={styles.title}>
            <Breadcrumb items={items} />
            <p className={styles.h5Tc}>團露詳情。</p>
          </div>
          <div className={styles.eventDetail}>
            <div className={styles.intro}>
              <div className={styles.cardInfo}>
                {/* <img alt="" src="../images/event_card.jpg" /> */}
                <Image
                  className={styles.cardImage}
                  src="/group-camping/event_card.jpg"
                  alt="Group Camping Event Image"
                  width={250}
                  height={0}
                  layout="intrinsic"
                  objectFit="cover"
                />
                <p className={`${styles.title} ${styles.h6Tc}`}>
                  《柳杉,隧道,舊鐵道橋》眠月線 兩天一夜
                </p>
              </div>
              <div className={styles.eventDate}>
                <div className={`${styles.date} ${styles.dateStart}`}>
                  <p className={styles.textGray}>開始日期</p>
                  <p className={styles.h3En}>7</p>
                  <p className={styles.textGray}>
                    <span className={styles.p1En}>7</span>月
                  </p>
                  <p className={styles.textGray}>星期五</p>
                </div>
                <hr />
                <div className={`${styles.date} ${styles.dateEnd}`}>
                  <p className={styles.textGray}>結束日期</p>
                  <p className={styles.h3En}>10</p>
                  <p className={styles.textGray}>
                    <span className={styles.p1En}>7</span>月
                  </p>
                  <p className={styles.textGray}>星期日</p>
                </div>
              </div>
            </div>
            <div className={`${styles.detail} ${styles.description}`}>
              <p className={styles.h6Tc}>團露介紹</p>
              <hr />
              <p className={styles.p1Tc}>
                早期眠月線的開發是日本政府為了運送山下砍伐的巨木而建造，後為了發展觀光，在民國
                <span className={styles.p1En}>72</span>
                年時開始使用古老的蒸汽火車載客，當時在國內外，都造成了鐵路迷的大轟動。而眠月線是阿里山鐵道支線之一，起於阿里山新站，止於石猴站，全長「
                <span className={styles.p1En}>9.2</span>
                公里」，沿途共經過「
                <span className={styles.p1En}>24</span>
                個橋樑與
                <span className={styles.p1En}>12</span>
                個隧道」。
                <br />
                <br />
                <span className={styles.p1En}>1999</span>
                年因為
                <span className={styles.p1En}>921</span>
                大地震，鐵路坍方而停駛，而後經過一番修復曾經短暫恢復通車，不料
                <span className={styles.p1En}>2008</span>
                年又遭遇八八風災再度損毀，至今未再復駛。因為沿途的景色優美，且擁有森林、鐵道、車站、高空鐵橋等多重景觀，且坡度平緩，行走難度平易近人，如今已經成為了深受遊客喜愛的健走路線。
              </p>
            </div>
            <div className={`${styles.detail} ${styles.location}`}>
              <p className={`${styles.title} ${styles.h6Tc}`}>地點</p>
              <hr />
              <p className={styles.text}>
                <span className="material-symbols-outlined"> location_on </span>
                嘉義縣梅山鄉瑞里村瑞里
                <span className={styles.p1En}>75</span>號
                <a
                  href="https://maps.app.goo.gl/Jj647Ab99GnacBXR6"
                  target="_blank"
                >
                  查看地圖
                </a>
              </p>
              <div id="map" />
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
                      組長
                    </div>
                    宋庭毓
                  </div>
                  <div
                    className={`${styles.member} ${styles.participants} ${styles.h6Tc}`}
                  >
                    <div className={`${styles.tag} ${styles.tagParticipant}`}>
                      組員
                    </div>
                    <div className={styles.participant}>
                      簡珩宇 | 陳哲偉 | 蔡易達 | 賴聖儒 | 田承鎬
                    </div>
                  </div>
                </div>
                <button className={styles.btnCancel} onClick={handleModalOpen}>
                  <span className="material-symbols-outlined"> logout </span>
                  <span className={styles.p2Tc}>退出團露</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && <ModalCancelEvent onClose={handleModalClose} />}
      <Footer />
    </>
  )
}
