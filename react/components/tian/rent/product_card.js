import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

import toast, { Toaster } from 'react-hot-toast'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test'

export default function Product_card({
  product,
  index,
  errorMsg,
  successMsg,
  userCollect,
}) {
  const router = useRouter()

  // 登入與否的hook
  const { auth } = useAuthTest()
  // 用useEffect再低一次渲染的時候就將userId設定好
  const [userId, setUserId] = useState(null)

  // 從購物車鉤子引入需要的東西
  const { items, handleAdd } = useRentcart()

  // 從搜尋鉤子 引入需要的東西
  const {
    searchValue = {},
    calenderValue = '',
    setCalenderValue,
    timeDifference,
    setSortValue,
    cate,
    setCate,
    tagValues,
    setTagValues,
    handleQuery,
    handleKeywordChange = () => {},
  } = useQuery()

  // 新增至收藏 的愛心變化（實心空心）
  const [like, setLike] = useState(false)

  const handleAddLike = (e) => {
    // 阻止冒泡事件
    e.stopPropagation()

    if (!auth.isAuth) {
      errorMsg('請先登入帳號')
      return
    }

    if (like !== false) {
      setLike(false)
      deleteAddLike()
      return
    }
    setLike(true)
    insertAddLike()
  }

  const insertAddLike = async () => {
    // 請求時要帶的資料
    const likeFormData = {
      product_id: product.product_id,
    }

    const url = `http://localhost:3005/api/rent_collect/${userId}`
    try {
      const res = await axios.post(url, likeFormData)

      const { status } = res.data
      if (status === 'success') {
        console.log(res.data.msg)
        successMsg(`商品已加入收藏`)
      }
    } catch (err) {
      console.log(`加入收藏失敗，錯誤訊息：${err}`)
    }
  }

  const deleteAddLike = async () => {
    const url = `http://localhost:3005/api/rent_collect/${userId}/product/${product.product_id}`
    try {
      const res = await axios.delete(url)

      const { status } = res.data
      if (status === 'success') {
        console.log(res.data.msg)
        successMsg(`商品已取消收藏`)
      }
    } catch (err) {
      console.log(`取消收藏失敗，錯誤訊息：${err}`)
    }
  }

  // 點選商品卡片時進行的動作
  const handleDetailId = () => {
    // 將id設定進入sessionStorage
    sessionStorage.setItem('detailId', product.product_id)

    router.push(
      `http://localhost:3000/rent/product_detail?id=${product.product_id}`
    )
  }

  const addToCart = (e, id) => {
    e.stopPropagation()
    if (!auth.isAuth) {
      errorMsg(`請先登入帳號`)
      return
    }

    let start
    let end

    if (sessionStorage.getItem('timeRange')) {
      let timeRange = sessionStorage.getItem('timeRange')
      console.log(timeRange)
      start = timeRange.split('~')[0]
      end = timeRange.split('~')[1]

      if (start === '請選擇時段') {
        const msg = `請先選擇租賃時段`
        errorMsg(msg)
        return
      }
    } else {
      errorMsg(`請重新選擇時段`)
      return
    }

    let currentDateTime = new Date().toISOString()

    console.log(JSON.stringify(product))

    let sendItem = {
      user_id: userId,
      shop_id: sessionStorage.getItem('shopId'),
      product_id: product.product_id,
      product_name: product.product_name,
      main_img: product.main_img,
      price_id: product.min_price_id,
      price: product.price,
      style: '',
      size: '',
      start_time: start,
      end_time: end,
      create_datetime: currentDateTime,
      checked: false,
      qty: 1,
    }

    console.log(`準備塞入的商品${JSON.stringify(sendItem)}`)

    handleAdd(sendItem)

    const msg = `成功加入購物車！`
    successMsg(msg)
  }

  const checkIsAuth = () => {
    if (!auth.isAuth) {
      errorMsg(`請先登入帳號`)
      return
    }
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {}, [items])

  useEffect(() => {
    if (auth.isAuth) {
      setUserId(auth.userData.id)
    }
    setLike(
      !!userCollect.find(
        (collect, i) => collect.product_id === product.product_id
      )
    )
  }, [userCollect])

  return (
    <>
      <div
        key={product.product_id}
        className="productCard-tian"
        onClick={handleDetailId}
      >
        <div
          onClick={handleAddLike}
          className={`material-symbols-outlined addLike ${
            like === true && 'active'
          }`}
        >
          favorite
        </div>

        <div className="productImg">
          {product.main_img ? (
            <React.Fragment key={product.product_id}>
              <img src={`/tian/image/${product.main_img}`} alt="" />
            </React.Fragment>
          ) : (
            <>
              <div
                className="d-flex justify-content-center align-items-center sub-text-tian p1-en-tian"
                style={{ width: '100%', aspectRatio: '1/1' }}
              >
                <span className="material-symbols-outlined me-1">camping</span>
                no picture
              </div>
            </>
          )}
        </div>
        <div className="info">
          <div className="infoHeader d-flex flex-column align-items-start">
            <p className="infoTitle dark-text-tian m-0">
              {product.product_name}
            </p>
            <div className="infoTag d-flex justify-content-start">
              <span className="tag p3-tc-tian light-text-tian prompt-bg-tian">
                {product.brand_child}
              </span>
              <span className="tag p3-en-tian light-text-tian secondary-bg-tian">
                {product.parent_name}
              </span>
            </div>
          </div>
          <div className="infoBody">
            <p className="p3-tc-tian mx-3">
              {product.product_brief.split('<br/>').map((line, i) => {
                return (
                  <React.Fragment key={i}>
                    <span>{line}</span>
                    <br />
                  </React.Fragment>
                )
              })}
            </p>
          </div>
          <div className="infoFooter d-flex justify-content-between">
            <div>
              <span className="p1-en-tian dark-text-tain">$</span>
              <span className="p1-en-tian dark-text-tain">{` ${product.price} `}</span>
              <span className="p2-en-tian dark-text-tain">/ Day</span>
            </div>
            <div
              className="addCart"
              onClick={(e) => {
                addToCart(e, product.product_id)
              }}
            >
              <span
                className="material-symbols-outlined "
                // onClick={handleAdd(product)}
              >
                add_shopping_cart
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
