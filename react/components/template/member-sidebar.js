import React from 'react'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const Aside = dynamic(() => import('@/components/template/sidebar'), {
  ssr: false,
})

export default function MemberSidebar() {
  return (
    <>
      <Aside
        title="會員中心"
        mainLabels={[
          {
            title: '帳戶資訊',
            icon: (
              <>
                <span class="material-symbols-outlined">person</span>
              </>
            ),
            subLabel: ['個人資料'],
            subLink: ['/member-test/profile-test'],
          },
          {
            title: '收藏清單',
            icon: (
              <>
                <span class="material-symbols-outlined">favorite</span>
              </>
            ),
            subLabel: ['我的收藏'],
            subLink: ['/member-test/collect'],
          },
          {
            title: '訂單紀錄',
            icon: (
              <>
                <span class="material-symbols-outlined">shopping_basket</span>
              </>
            ),
            subLabel: ['露營用具', '營地'],
            subLink: [
              '/member-test/p-order-history',
              '/member-test/c-order-history',
            ],
          },
          {
            title: '團露紀錄',
            icon: (
              <>
                <span class="material-symbols-outlined">groups</span>
              </>
            ),
            subLabel: ['我的團露紀錄'],
            subLink: ['/member-test/my-event'],
          },
          {
            title: '優惠卷',
            icon: (
              <>
                <span class="material-symbols-outlined">
                  confirmation_number
                </span>
              </>
            ),
            subLabel: ['我的優惠券'],
            subLink: ['/member-test/my-coupon'],
          },
          {
            title: '客服中心',
            icon: (
              <>
                <span class="material-symbols-outlined">chat</span>
              </>
            ),
            subLabel: ['我的客服單'],
            subLink: ['/member-test/custerServer'],
          },
        ]}
      />
    </>
  )
}
