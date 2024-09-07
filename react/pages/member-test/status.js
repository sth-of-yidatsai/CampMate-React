import { useAuthTest, initUserData } from '@/hooks/use-auth-test'
import { checkAuth, login, logout, getUserById } from '@/services/user'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})

const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})

export default function MemberIndex() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // 登入後設定全域的會員資料用
  const { auth, setAuth } = useAuthTest()

  // 處理登出
  const handleLogout = async () => {
    const res = await logout()

    console.log(res.data)

    // 成功登出個回復初始會員狀態
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

  // 處理檢查登入狀態
  const handleCheckAuth = async () => {
    const res = await checkAuth()

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('已登入會員')
    } else {
      toast.error(`非會員身份`)
    }
  }
  return (
    <>
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
                    lv2Name: '帳篷',
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
      <main style={{ height: '100vh' }}>
        <h1>會員登入狀態: {auth.isAuth ? '已登入' : '未登入'}</h1>
        <button onClick={handleLogout}>登出(logout)</button>
      </main>
      {isDesktopOrLaptop && <Footer />}
      {isTabletOrMobile && <FooterM />}
    </>
  )
}
