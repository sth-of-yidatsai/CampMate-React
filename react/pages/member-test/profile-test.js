import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import TicketsTest from '@/components/custer-service/ticket_test'
import UserProfile from '@/styles/userprofile.module.css'
import { useRouter } from 'next/router'
import MemberSidebar from '@/components/template/member-sidebar'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import EditingWindow from '@/components/member/editingwindow'
import styles from '@/components/member/modal.module.css'

import useFirebase from '@/hooks/use-firebase'
import { useAuthTest, initUserData } from '@/hooks/use-auth-test'
import { logout } from '@/services/user-test'
import toast, { Toaster } from 'react-hot-toast'

// 轉圈動畫
import { FadeLoader } from 'react-spinners'
// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

//aside 圖樣
import { ImUser } from 'react-icons/im'
import { ImHeart } from 'react-icons/im'
import { BsCartCheckFill } from 'react-icons/bs'
import { FaPeopleGroup } from 'react-icons/fa6'
import { LuTicket } from 'react-icons/lu'
import { LiaHeadsetSolid } from 'react-icons/lia'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})

const Aside = dynamic(() => import('@/components/custer-service/sidebar'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})

const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})

export default function ProfileTest() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  // 轉圈圈
  const override = {
    display: 'block',
    margin: 'auto',
    marginTop: '50vh',
    // borderColor: 'red',
  }
  const loader = (
    <FadeLoader
      color="#574426"
      cssOverride={override}
      size={30}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )

  // 抓 Auth 裡面的 user 資料 ==> 這邊可以抓到 user 的 id
  const { auth, setAuth } = useAuthTest()
  const { logoutFirebase } = useFirebase()
  const [userInfo, setUserInfo] = useState({})

  const [showEditModal, setShowEditModal] = useState(false)

  // 抓使用者的所有資訊(除了密碼)
  const getUserInfo = async () => {
    const url = `http://localhost:3005/api/users-test/${auth.userData.id}`
    try {
      const response = await fetch(url, {
        credentials: 'include',
      })
      const result = await response.json()

      if (result.status === 'success') {
        console.log(result.data.user)
        setUserInfo(result.data.user)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 處理登出
  const handleLogout = async () => {
    // firebase logout(注意，這並不會登出google帳號，是登出firebase的帳號)
    logoutFirebase()

    const res = await logout()

    // 成功登出後，回復初始會員狀態
    if (res.data.status === 'success') {
      toast.success('已成功登出')

      setAuth({
        isAuth: false,
        userData: initUserData,
      })
    } else {
      toast.error(`登出失敗`)
    }
  }

  useEffect(() => {
    if (auth.userData.id) {
      getUserInfo()
    }
  }, [auth])

  const breadcrumbItems = [
    { name: 'HOME', href: '/' },
    { name: '帳戶資訊', href: 'profile-test' },
    { name: '個人資料', href: 'profile-test' },
  ]
  const orderStatus = [{ statusName: '個人資料' }, { statusName: '' }]

  const [status, setStatus] = useState(orderStatus)

  const [activeIndex, setActiveIndex] = useState(0) // 跟踪當前選中的索引

  const handleClick = (index) => {
    setActiveIndex(index) // 更新選中的索引
  }

  //彈出視窗
  const handleOpenModal = () => setShowEditModal(true)
  const handleCloseModal = () => setShowEditModal(false)

  return (
    <>
      <Toaster />

      {isDesktopOrLaptop && <Header />}
      {/* 請按照下列格式填入需要的欄位 */}
      {isTabletOrMobile && (
        <HeaderM
          labels={{
            user: { userName: '王小明', userIcon: myIcon },
            titles: [
              {
                lv1Name: 'Customer Center',
                lv1Icon: <FaRegUser style={{ fill: '#413c1c' }} />,
                // 沒有lv2的話請填入null
                titleLv2: null,
              },
              {
                lv1Name: 'Rent',
                lv1Icon: <MdOutlineChair style={{ fill: '#413c1c' }} />,
                titleLv2: [
                  {
                    lv2Name: '帳戶資訊',
                    lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                    titleLv3: [
                      '單/雙人',
                      '家庭',
                      '寵物',
                      '客廳帳/天幕',
                      '配件',
                      '其他',
                    ],
                  },
                  {
                    lv2Name: '戶外家具',
                    lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                    titleLv3: ['露營椅', '露營桌', '其他'],
                  },
                ],
              },
              {
                lv1Name: 'Ground',
                lv1Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                titleLv2: [
                  {
                    lv2Name: '營地主後台',
                    lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                    titleLv3: [],
                  },
                ],
              },
            ],
          }}
        />
      )}
      <div className={UserProfile.total}>
        <div className="container text-center">
          <div className="row justify-content-start ">
            <div className="col-2">
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {isDesktopOrLaptop && (
                  <MemberSidebar/>
                )}
              </div>
            </div>
            <div className="col-1" />
            <div className="col-9">
              <Breadcrumb items={breadcrumbItems} />
              <h2 className={UserProfile.pageTitle}>
                <span className={UserProfile.h2}>我的個人資料</span>
              </h2>
              <div className={UserProfile.nanav}>
                <div className="listTab-tian">
                  <ul className="nav nav-tabs">
                    {status.map((v, i) => {
                      return (
                        <li key={i} className="nav-item">
                          <div className="left" />
                          <a
                            className={`nav-link ${
                              i === activeIndex ? 'active' : ''
                            }`}
                            aria-current="page"
                            href="#"
                            onClick={() => handleClick(i)}
                          >
                            {v.statusName}
                          </a>
                          <div className="right" />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className={UserProfile.card1h}>
                {/* <p>{auth?.userData?.id}的個人資料</p> */}
                <p>{auth?.userData?.account} 的個人資料</p>
              </div>
              <div className={UserProfile.card1b}>
                <div className={UserProfile.form}>
                  <p className={UserProfile.space}>帳號</p>
                  <p className={UserProfile.space}>密碼</p>
                  <p className={UserProfile.space}>姓名</p>
                  <p className={UserProfile.space}>生日</p>
                  <p className={UserProfile.space}>電話</p>
                  <p className={UserProfile.space}>身份證字號</p>
                  <p className={UserProfile.space}>電子郵件</p>
                  <p className={UserProfile.space}>地址</p>
                </div>
                <div className={UserProfile.form2}>
                  <p>&nbsp;{auth.userData.account}</p>
                  {/* password 通常應該不會放(?) jwt 的 payload 可以不需要 secret key 就能 decode , 建議不要將在 login 時要的資料直接放在這*/}
                  <p>************{}</p>
                  <p>&nbsp;{userInfo.name}</p>
                  <p>&nbsp;{userInfo.birth_date}</p>
                  <p>&nbsp;{userInfo.phone}</p>
                  <p>&nbsp;{userInfo.id_number}</p>
                  <p>&nbsp;{userInfo.email}</p>
                  <p>&nbsp;{userInfo.address}</p>
                  {/* <p>帳號 {auth?.userData?.username}</p>*/}
                </div>
                <div className={UserProfile.card2}>
                  <div className={UserProfile.card2h} />
                  <div className={UserProfile.card2b}>
                    <img
                      src={userInfo.photo_url}
                      alt=""
                      name="userPhoto"
                      style={{
                        width: '109px',
                        height: '109px',
                        borderRadius: '60px',
                      }}
                    />
                  </div>
                  {auth?.userData?.account}
                </div>
                <div>
                  <button
                    href="#"
                    className={UserProfile.btn}
                    onClick={handleOpenModal}
                  >
                    編輯
                  </button>
                  {/* 跳窗修改表格內容 */}
                  {showEditModal && (
                    <div className={styles.modalBackdrop}>
                      <div className={styles.modalContent}>
                        <div className={styles.modalClose}>
                          <button
                            className={styles.closeButton}
                            onClick={handleCloseModal}
                          ></button>
                        </div>
                        <EditingWindow onClose={handleCloseModal} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDesktopOrLaptop && <Footer />}
      {isTabletOrMobile && <FooterM />}
    </>
  )
}
