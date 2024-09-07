import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
// import { useRouter } from 'next/router'

// 1. 建立與導出它
const RentcartContext = createContext(null)

// 2. 建立一個Context Provider元件
export function RentcartProvider({ children }) {
  // 加入到購物車的商品項目
  // 以其中的物件資料比較原商品物件，需要多了一個qty(數量)屬性
  const initItems = () => {
    // 確保只有在客戶端環境中才使用 localStorage
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('rent_cart')
      let cart = []

      if (cartData) {
        try {
          cart = JSON.parse(cartData)
        } catch (error) {
          console.error('Error parsing rent_cart from localStorage', error)
          cart = [] // 若解析出錯，返回空陣列
        }
      }

      return cart
    } else {
      return [] // 在伺服器端返回空陣列
    }
  }

  const [items, setItems] = useState(initItems)

  //----------------------------------------------------------------------

  const handleIncrease = (id, count) => {
    const nextItems = items.map((v, i) => {
      // 如果符合(id相當於傳入的id)的物件，遞增其中屬性qty的數字
      if (v.price_id === id) return { ...v, qty: v.qty + count }
      // 否則回傳原本物件
      else return v
    })

    setItems(nextItems)
  }

  const handleDecrease = (id, count) => {
    let nextItems = items.map((v, i) => {
      // 如果符合(id相當於傳入的id)的物件，遞減其中屬性qty的數字
      if (v.price_id === id) return { ...v, qty: v.qty - count }
      // 否則回傳原本物件
      else return v
    })

    // 官網解法，設定到狀態前，先過濾掉qty=0的item
    nextItems = nextItems.filter((v) => v.qty > 0)

    setItems(nextItems)
  }

  //----------------------------------------------------------------------

  const handleRemove = (id) => {
    const nextItems = items.filter((v, i) => {
      return v.price_id !== id
    })

    setItems(nextItems)
  }

  const handleAdd = (product) => {
    console.log(JSON.stringify(product))
    // 先尋找此商品是否已經在購物車裡
    const foundIndex = items.findIndex((v) => v.price_id === product.price_id)

    if (foundIndex > -1) {
      // 如果有找到===>遞增數量
      // console.log(`看一下qty是多少${product.qty}`)
      handleIncrease(product.price_id, product.qty)
    } else {
      // 否則 ===> 新增商品到購物車項目
      // 擴充商品物件多一個qty新屬性，預設為1
      const newItem = { ...product, qty: product.qty }
      const nextItems = [newItem, ...items]
      setItems(nextItems)
    }
  }

  const cleanItems = () => {
    setItems([])
  }

  //----------------------------------------------------------------------

  // const handleInsertCart = async () => {
  //   const initUrl = `http://localhost:3005/api/rent_cart`

  //   await axios
  //     .post(initUrl, items)
  //     .then((res) => {})
  //     .catch((err) => {})
  // }

  //----------------------------------------------------------------------

  const [totalPrice, setTotalPrice] = useState('')
  const [totalQty, setTotalQty] = useState('')
  const cartCount = () => {
    // 將字串轉換為 Date 對象
    const date1 = new Date(items[0].start_time)
    const date2 = new Date(items[0].end_time)

    // 計算兩個日期之間的毫秒差
    const timeDiff = Math.abs(date2 - date1) // 使用 Math.abs 以防日期順序錯誤

    // 將毫秒差轉換為天數
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    const checkedItems = items.filter((v) => v.checked)
    // 計算總金額與數量，用陣列迭代方法reduce (累加、歸納)
    const tQty = items.reduce((acc, v) => acc + v.qty, 0)

    const tPrice = checkedItems.reduce(
      (acc, v) => acc + v.qty * v.price * diffDays,
      0
    )

    setTotalQty(tQty)
    setTotalPrice(tPrice)
  }

  //----------------------------------------------------------------------

  const [selectedValue, setSelectedValue] = useState(null)
  const [maxDiscount, setMaxDiscount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(totalPrice)
  // 選定的coupon
  const [selectedCoupon, setSelectedCoupon] = useState({})

  //----------------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log(items)
    if (items) {
      // console.log(`設定進去localstorage前${JSON.stringify(items)}`)
      localStorage.setItem('rent_cart', JSON.stringify(items))
      if (items.length > 0) {
        cartCount()
      }
    }
    if (items.length === 0) {
      setTotalQty(0)
      setTotalPrice(0)
    }
  }, [items])

  return (
    <RentcartContext.Provider
      value={{
        items,
        setItems,
        handleAdd,
        handleDecrease,
        handleIncrease,
        handleRemove,
        cleanItems,
        totalPrice,
        totalQty,
        selectedValue,
        setSelectedValue,
        maxDiscount,
        setMaxDiscount,
        finalAmount,
        setFinalAmount,
        selectedCoupon,
        setSelectedCoupon,
      }}
    >
      {children}
    </RentcartContext.Provider>
  )
}

// 3. 建立一個包裝useContext與對應context的專用函式
export const useRentcart = () => useContext(RentcartContext)
