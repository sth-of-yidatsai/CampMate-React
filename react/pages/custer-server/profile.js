import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import TicketsTest from '@/components/custer-service/ticket_test'
import UserFrofile from '@/styles/userprofile.module.css'
import { useContext } from 'react'
import { initUserData, useAuth } from '@/hooks/use-auth'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'

// 開發期間使用，之後可以從useAuth中得到
const userId = 1

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

export default function profile() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // const { auth } = useContext(AuthContext)

  // // 2. 在任何後代元件層級深度，使⽤ useContext(MyContext)勾⼦讀取它
  // const { auth, login, logout } = useContext(AuthContext)

  const breadcrumbItems = [
    { name: 'HOME', href: '/' },
    { name: '帳戶資訊', href: 'profile' },
    { name: '個人資料', href: 'profile' },
  ]
  const orderStatus = [
    { statusName: '個人資料' },
    { statusName: '取件資訊' },
    { statusName: '' },
  ]

  const [status, setStatus] = useState(orderStatus)

  const [activeIndex, setActiveIndex] = useState(0) // 跟踪當前選中的索引

  const handleClick = (index) => {
    setActiveIndex(index) // 更新選中的索引
  }

  return (
    <>
      <div className={UserFrofile.total}>
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
        <div className="container text-center">
          <div className="row justify-content-start ">
            <div className="col-2">
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {isDesktopOrLaptop && (
                  <Aside
                    mainLabels={[
                      {
                        title: '帳戶資訊',
                        icon: <ImUser />,
                        subLabel: ['個人資料', '取件資訊'],
                      },
                      {
                        title: '收藏清單',
                        icon: <ImHeart />,
                        subLabel: ['營地', '用品'],
                      },
                      {
                        title: '訂單記錄',
                        icon: <BsCartCheckFill />,
                        subLabel: ['露營地訂位', '租借露營用品'],
                      },
                      {
                        title: '團露紀錄',
                        icon: <FaPeopleGroup />,
                        subLabel: ['我的團露'],
                      },
                      {
                        title: '優惠卷',
                        icon: <LuTicket />,
                        subLabel: ['我的優惠券', '領取更多優惠卷'],
                      },
                      {
                        title: '客服中心',
                        icon: <LiaHeadsetSolid />,
                        subLabel: ['客服系統'],
                      },
                    ]}
                  />
                )}
              </div>
            </div>
            <div className="col-1" />
            <div className="col-9">
              <Breadcrumb items={breadcrumbItems} />
              <h2 className={UserFrofile.pageTitle}>
                <span className={UserFrofile.h2}>我的個人資料</span>
              </h2>
              <div className={UserFrofile.nanav}>
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

              <div className={UserFrofile.card1h}>
                {/* <p>{auth?.userData?.id}的個人資料</p> */}
                <p>的個人資料</p>
              </div>
              <div className={UserFrofile.card1b}>
                <div className={UserFrofile.form}>
                  {/* <p>會員id {auth.userData.id}</p> */}
                  <p className={UserFrofile.space}>帳號</p>
                  <p className={UserFrofile.space}>密碼</p>
                  <p className={UserFrofile.space}>姓名</p>
                  <p className={UserFrofile.space}>生日</p>
                  <p className={UserFrofile.space}>手機號碼</p>
                  <p className={UserFrofile.space}>身份證字號</p>
                  <p className={UserFrofile.space}>Email</p>
                  <p className={UserFrofile.space}>地址</p>
                </div>
                <div className={UserFrofile.form2}>
                  <p>Na_779</p>
                  <p>123456893</p>
                  <p>NANA</p>
                  <p>1982-02-02</p>
                  <p>0972-664-559</p>
                  <p>T22391837</p>
                  <p>na_779@outlook.com</p>
                  <p>新北市中和區中正路</p>
                  {/* <p>帳號 {auth?.userData?.username}</p>*/}
                </div>
                <div className={UserFrofile.card2}>
                  <div className={UserFrofile.card2h} />
                  <div className={UserFrofile.card2b}>
                    <div>
                      <input
                        className="form-control form-control-sm"
                        id="formFileSm"
                        type="file"
                      />
                    </div>
                    <img src="/images/胖達.jpg" alt="" name="userPhoto" />
                  </div>
                  Na_779
                </div>
              </div>
            </div>
          </div>
        </div>
        {isDesktopOrLaptop && <Footer />}
        {isTabletOrMobile && <FooterM />}
      </div>
    </>
  )
}
