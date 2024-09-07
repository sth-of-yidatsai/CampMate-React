import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useQuery } from '@/hooks/use-query'
import { useAuthTest } from '@/hooks/use-auth-test'

import Rank from '@/components/tian/rent/rank'

export default function Product_title({ errorMsg, successMsg, userCollect }) {
  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const { singleProduct, setSingleProduct } = useQuery()

  // 新增至收藏 的愛心變化（實心空心）
  const [like, setLike] = useState(false)
  const handleAddLike = () => {
    if (!auth.isAuth) {
      const msg = '請先登入'
      errorMsg(msg)
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
      product_id: singleProduct.product_id,
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
    const url = `http://localhost:3005/api/rent_collect/${userId}/product/${singleProduct.product_id}`
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

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log(singleProduct)
  }, [singleProduct])

  useEffect(() => {
    if (auth.isAuth) {
      console.log(`有登入`)
      setUserId(auth.userData.id)
    }
    if (isClient) {
      console.log(userCollect)
      console.log(singleProduct?.product_id)
      setLike(
        !!userCollect.find(
          (collect, i) => collect.product_id === singleProduct?.product_id
        )
      )

      console.log(
        !!userCollect.find(
          (collect, i) => collect.product_id === singleProduct?.product_id
        )
      )
    }
  }, [userCollect, singleProduct])

  return (
    <>
      <div className="optionHeader-tian">
        <h2 className="brandName header-en-tian primary-text-tian">
          {singleProduct != undefined && singleProduct.brand_name}
        </h2>
        <div className="title_like d-flex justify-content-between align-items-baseline gap-4">
          <h1 className="productName h4-tc-tian">
            {singleProduct != undefined && singleProduct.product_name}
          </h1>
          <div
            onClick={handleAddLike}
            className={`material-symbols-outlined addLike ${
              like === true && 'active'
            }`}
          >
            favorite
          </div>
        </div>
        <Rank />
      </div>
    </>
  )
}
