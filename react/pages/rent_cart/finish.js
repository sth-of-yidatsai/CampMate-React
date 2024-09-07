import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

import Header from '@/components/template/header'
import Footer from '@/components/template/footer'

import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

import Cart_process from '@/components/tian/rent_cart/cart_process'
import PayList_card from '@/components/tian/rent_cart/payList_card'

import CouponModal from '@/components/tian/rent_cart/coupon/couponModal'
import PickupModal from '@/components/tian/rent_cart/pickupModal'
import AddpickupModal from '@/components/tian/rent_cart/addpickupModal'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

export default function Cart_pay() {
  const { items, setItems } = useRentcart()
  const { setCalenderValue, setShopValue } = useQuery()
  // 設定頁面標題
  const [pageTitle, setPageTitle] = useState({
    title: '購物車。',
    subTitle: '預定完成。',
  })

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
    { name: '購物車', href: '/rent_cart' },
  ]

  //-----------------------------------------------

  const updateOrderStatus = async () => {
    try {
      const orderId = localStorage.getItem('orderId')
      console.log(orderId)
      const url = `http://localhost:3005/api/rent_order/${orderId}`

      const res = await axios.put(url, {
        status: '已付款',
      })

      const status = res.data.status
      if (status === 'success') {
        console.log(`成功更新訂單狀態`)
        localStorage.removeItem('orderId')
      }
    } catch (err) {
      console.log(`更新訂單狀態失敗，錯誤訊息：${err}`)
    }
  }

  //-----------------------------------------------

  // 控制購物車流程圖示
  const [process, setProcess] = useState('')

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setProcess(4)
    setIsClient(true)
  }, [])

  const router = useRouter()
  useEffect(() => {
    if (router.isReady) {
      console.log(router.query.RtnCode)
      if (router.query.RtnCode || router.query.transactionId) {
        console.log('你已經付款成功咯')
        localStorage.removeItem('rent_order')
        localStorage.removeItem('rent_cart')
        sessionStorage.removeItem('timeRange')
        sessionStorage.removeItem('shopId')
        setCalenderValue('請選擇時段')
        setShopValue('')
        setItems([])
        console.log(`清除購物車 訂單 時段 店面資訊`)

        updateOrderStatus()

        setTimeout(() => {
          router.push(`/member-test/p-order-history`)
        }, 2000)
      }
      // eslint-disable-next-line
    }
  }, [router.isReady])

  useEffect(() => {
    console.log(`finish頁面：`)
    console.log(items)
  }, [items])

  return (
    <>
      <Header />
      <main className="mainArea-pay-tian mainArea-tian">
        <section className="cartTitle">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Breadcrumb items={breadcrumbItems} />
          {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
          <Page_title pageTitle={pageTitle} />
        </section>

        {/*## ↓↓↓↓ 購物車流程圖示 ↓↓↓↓ */}
        <Cart_process process={process} />
        <div className="payStatus d-flex justify-content-center p-5 m-5">
          {router.isReady &&
          (router.query.RtnCode || router.query.transactionId) ? (
            <div className="p1-tc-tian sub-text-tian">
              已成功付款，將自動前往
              <Link
                className="prompt-text-tian"
                href={`/member-test/p-order-history`}
              >
                訂單記錄
              </Link>
              。
            </div>
          ) : (
            <div className="p1-tc-tian sub-text-tian">
              付款失敗，請洽客服人員。
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Top_btn />
    </>
  )
}
