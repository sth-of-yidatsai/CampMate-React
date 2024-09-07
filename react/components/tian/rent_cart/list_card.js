import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test'

import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function List_card({
  handleSingleCheck,
  item,
  index,
  checkArr,
  removeCartItem,
  successMsg,
  errorMsg,
  userCollect,
}) {
  const router = useRouter()

  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const {
    items,
    setItems,
    andleAdd,
    handleDecrease,
    handleIncrease,
    handleRemove,
    cleanItems,
  } = useRentcart()

  // --------------------------------------------------------------

  // 加入收藏變數
  const [like, setLike] = useState(false)
  const handleAddLike = () => {
    if (like !== false) {
      setLike(false)
      deleteAddLike()
      return
    }
    setLike(true)
    insertAddLike()
  }

  //----------------------------------------------------

  const insertAddLike = async () => {
    // 請求時要帶的資料
    const likeFormData = {
      product_id: item.product_id,
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
    const url = `http://localhost:3005/api/rent_collect/${userId}/product/${item.product_id}`
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

  // --------------------------------------------------------------

  // 商品選擇數量的變數
  const [count, setCount] = useState(0)
  const handlePlus = () => {
    setCount(count + 1)
    handleIncrease(item.price_id, 1)
  }
  const handleReduce = () => {
    if (count === 0) {
      setCount(0)

      return
    }
    setCount(count - 1)
    handleDecrease(item.price_id, 1)
  }
  const handleChange = (e) => {
    const value = Number(e.target.value)
    setCount(value)
  }

  // --------------------------------------------------------------

  // 將字串轉換為 Date 對象
  const date1 = new Date(item.start_time)
  const date2 = new Date(item.end_time)

  // 計算兩個日期之間的毫秒差
  const timeDiff = Math.abs(date2 - date1) // 使用 Math.abs 以防日期順序錯誤

  // 將毫秒差轉換為天數
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  // --------------------------------------------------------------

  const handleChangeStyle = (e) => {
    // console.log(`測試有沒有改到${index} 值${e.target.value}`)
    handleStyleChange(index, e.target.value)
  }

  const handleChangeSize = (e) => {
    // console.log(`測試有沒有改到${index} 值${e.target.value}`)
    handleSizeChange(index, e.target.value)
  }

  const changeChecked = (id) => {
    setItems((prevItems) => {
      return prevItems.map((v, i) => {
        // 如果符合(id相當於傳入的id)的物件，更新其中的checked屬性
        if (v.price_id === id) {
          return { ...v, checked: checkArr[index] }
        } else {
          return v
        }
      })
    })
  }

  const handleStyleTrans = (value, id) => {
    if (styles[index] && styles[index]?.length > 0) {
      const style = styles[index].find((v, i) => {
        if (v.price_id === value) {
          return v
        }
      })

      // console.log(style)
      // console.log(id)
      // console.log(styles[index])

      if (style) {
        // console.log(`有進來嗎`)
        setItems((preItems) => {
          return preItems.map((v, i) => {
            if (v.price_id === id) {
              return {
                ...v,
                price_id: style.price_id,
                price: style.product_price,
                style: style.style_name,
              }
            }
            return v
          })
        })
      }
    }

    // const msg = `成功加入購物車！`
    // successMsg(msg)
  }

  const handleSizeTrans = (value, id) => {
    if (sizes[index] && sizes[index]?.length > 0) {
      // console.log(sizes[index])

      // console.log(value)

      const size = sizes[index].find((v, i) => {
        if (v.price_id === value) {
          return v
        }
      })

      // console.log(id)
      // console.log(size)

      if (size) {
        // console.log(`有在這嗎`)
        setItems((preItems) => {
          return preItems.map((v, i) => {
            if (v.price_id === id) {
              return {
                ...v,
                price_id: size.price_id,
                price: size.product_price,
                size: size.size_name,
              }
            }
            return v
          })
        })
      }
    }
  }

  // --------------------------------------------------------------

  // 使否選取商品的核取方塊
  const [checked, setChecked] = useState(false)
  const handleCheck = () => {
    if (checked !== false) {
      setChecked(false)
      return
    }
    setChecked(true)
  }

  // --------------------------------------------------------------

  const [styleValue, setStyleValue] = useState({})
  const [sizeValue, setSizeValue] = useState({})

  const handleStyleChange = (index, value) => {
    // console.log(`有到這邊寫入嗎 index: ${index}  value: ${value}`)
    setStyleValue((prev) => ({ ...prev, [index]: value || '' }))
    // handleStyleTrans(value, item.price_id)
  }

  const handleSizeChange = (index, value) => {
    // console.log(`有到這邊寫入嗎 index: ${index}  value: ${value}`)
    setSizeValue((prev) => ({ ...prev, [index]: value || '' }))
    // handleSizeTrans(value, item.price_id)
  }

  const goToDetail = (e) => {
    e.stopPropagation()

    sessionStorage.setItem('detailId', item.product_id)

    router.push(`/rent/product_detail?id=${item.product_id}`)
  }

  // --------------------------------------------------------------

  const [styles, setStyles] = useState({})
  const [sizes, setSizes] = useState({})
  const [isFetch, setIsFetch] = useState(false)

  const handleStyles = (index, value) => {
    setStyles((prev) => ({ ...prev, [index]: value }))
  }

  const handleSizes = (index, value) => {
    setSizes((prev) => ({ ...prev, [index]: value }))
  }

  // 獲取此商品卡片的相關資訊 為了得到相關的style size 資訊
  const getPriceInfo = async (index, id) => {
    const initUrl = `http://localhost:3005/api/rent_product`

    const finalUrl = `${initUrl}/${id}`

    await axios
      .get(finalUrl, { withCredentials: true })
      .then((res) => {
        const { status, styles, sizes } = res.data

        if (status === 'success') {
          setIsFetch(!isFetch)
          handleStyles(index, styles)
          handleSizes(index, sizes)
        } else {
          setIsFetch(!isFetch)
          handleStyles(index, [])
          handleSizes(index, [])
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // --------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    setCount(item.qty)

    getPriceInfo(index, item.product_id)

    // console.log(`究竟執行了幾次${index}`)
  }, [])

  useEffect(() => {
    if (auth.isAuth) {
      setUserId(auth.userData.id)
    }
    setLike(
      !!userCollect.find((collect, i) => collect.product_id === item.product_id)
    )
    console.log(`有執行嗎`)
  }, [auth, userCollect])

  useEffect(() => {
    // console.log(`更新了items: ${JSON.stringify(items)}`)
    console.log(item)
  }, [items])

  useEffect(() => {
    changeChecked(item.price_id)
  }, [checkArr[index]])

  useEffect(() => {
    if (isClient) {
      if (Array.isArray(styles[index]) && styles[index]?.length > 0) {
        // console.log(`有進來嗎${JSON.stringify(styles[index])}`)
        // console.log(item.price_id)
        // console.log(styles[index].length > 0 ? item.price_id : '')
        const styleId =
          styles[index]?.find((style) => style.price_id === item.price_id)
            ?.price_id || ''

        // console.log(`選擇的 styleId: ${styleId}`)
        handleStyleChange(index, styleId || '')
      }
      if (Array.isArray(sizes[index]) && sizes[index]?.length > 0) {
        // console.log(`有進來嗎${JSON.stringify(sizes[index])}`)
        // console.log(item.price_id)
        // console.log(sizes[index].length > 0 ? item.price_id : '')
        const sizeId =
          sizes[index]?.find((size) => size.price_id === item.price_id)
            ?.price_id || ''

        // console.log(`選擇的 sizeId: ${sizeId}`)
        handleSizeChange(index, sizeId || '')
      }
    }
  }, [isClient, isFetch])

  useEffect(() => {
    if (isClient) {
      if (styleValue[index] && styleValue[index] !== '') {
        // console.log(
        //   `styleValue:${styleValue[index]}  index:${index}  id: ${item.price_id}`
        // )
        if (styleValue[index] !== item.price_id) {
          // console.log(`styleValue[index] !== item.price_id`)
          handleStyleTrans(styleValue[index], item.price_id)
        }
      } else if (sizeValue[index] && sizeValue[index] !== '') {
        // console.log(
        //   `sizeValue:${sizeValue[index]}  index: ${index} id: ${item.price_id}`
        // )
        if (sizeValue[index] !== item.price_id) {
          // console.log(`sizeValue[index] !== item.price_id`)
          handleSizeTrans(sizeValue[index], item.price_id)
        }
      }
    }
  }, [styleValue, sizeValue])

  return (
    <>
      {isClient && (
        <div className="listCard-tian">
          <Checkbox
            sx={{
              color: '#8f8e93',
              '&.Mui-checked': { color: '#e49366' },
              '& .MuiSvgIcon-root': {
                borderRadius: '8px', // 可選：設置外框的圓角
              },
            }}
            onClick={(e) => {
              handleSingleCheck(e, index)
            }}
            checked={checkArr[index]}
          />
          <div className="image">
            <div className="imgBox">
              <img src={`/tian/image/${item.main_img}`} alt="" />
            </div>
          </div>
          <div className="product">
            <div className="productTitle">
              <p
                className="p1-tc-tian dark-text-tian m-0 product_title"
                onClick={(e) => {
                  goToDetail(e)
                }}
              >
                {item.product_name}
              </p>
              <p className="p2-en-tian dark-text-tian m-0">
                {`${item.start_time} ~ ${item.end_time}`}
              </p>
            </div>
            <div className="productStyle">
              <div className="p1-tc-tian sub-text-tian">
                {isClient && styles[index] && styles[index]?.length > 0 && (
                  <FormControl sx={{ m: 0, width: 200 }} size="small">
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{
                        fontFamily: 'Noto Sans TC, sans-serif',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: '#8f8e93', // 標籤文字顏色
                        '&:hover': {
                          color: '#413c1c', // 滑鼠懸停時標籤文字顏色
                        },
                        '&.Mui-focused': {
                          color: '#574426', // 聚焦時標籤文字顏色
                        },
                      }}
                    >
                      選擇顏色
                    </InputLabel>
                    <Select
                      sx={{
                        color: '#413c1c', // 選項文字顏色
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#413c1c', // 初始邊框顏色
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e49366', // 滑鼠懸停時邊框顏色
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#413c1c', // 聚焦時邊框顏色
                        },
                        '.MuiSvgIcon-root': {
                          color: '#413c1c', // 修改箭頭顏色
                        },
                      }}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={styleValue[index] || ''}
                      label="選擇顏色"
                      onChange={handleChangeStyle}
                    >
                      <MenuItem value="">
                        <em>請選擇顏色</em>
                      </MenuItem>
                      {isClient &&
                        styles[index] &&
                        styles[index]?.length > 0 &&
                        styles[index].map((style, i) => {
                          return (
                            <MenuItem
                              key={style.price_id}
                              value={style.price_id}
                            >
                              {style.style_name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                )}
                {isClient && sizes[index] && sizes[index]?.length > 0 && (
                  <FormControl sx={{ m: 0, width: 200 }} size="small">
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{
                        fontFamily: 'Noto Sans TC, sans-serif',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: '#8f8e93', // 標籤文字顏色
                        '&:hover': {
                          color: '#413c1c', // 滑鼠懸停時標籤文字顏色
                        },
                        '&.Mui-focused': {
                          color: '#574426', // 聚焦時標籤文字顏色
                        },
                      }}
                    >
                      選擇尺寸
                    </InputLabel>
                    <Select
                      sx={{
                        color: '#413c1c', // 選項文字顏色
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#413c1c', // 初始邊框顏色
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e49366', // 滑鼠懸停時邊框顏色
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#413c1c', // 聚焦時邊框顏色
                        },
                        '.MuiSvgIcon-root': {
                          color: '#413c1c', // 修改箭頭顏色
                        },
                      }}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={sizeValue[index] || ''}
                      label="選擇尺寸"
                      onChange={handleChangeSize}
                    >
                      <MenuItem value="">
                        <em>請選擇尺寸</em>
                      </MenuItem>
                      {isClient &&
                        sizes[index] &&
                        sizes[index]?.length > 0 &&
                        sizes[index].map((size, i) => {
                          return (
                            <MenuItem key={size.price_id} value={size.price_id}>
                              {size.size_name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
          </div>
          <div className="day">
            <span className="p2-en-tian dark-text-tian">{diffDays}</span>
          </div>
          <div className="count">
            <div className="counter ">
              <button onClick={handleReduce}>
                <span className="reduce">-</span>
              </button>
              <input
                onChange={handleChange}
                className=" countNum p2-en-tian light-bg-tian"
                value={`${count}`}
              />
              <button onClick={handlePlus}>
                <span className="add">+</span>
              </button>
            </div>
          </div>
          <div className="amount p2-en-tian error-text-tian">
            <span>$</span>
            <span>{item.price * count * diffDays}</span>
          </div>
          <div className="operation">
            <div
              onClick={handleAddLike}
              className={`material-symbols-outlined addLike ${
                like === true ? 'active' : ''
              }`}
            >
              favorite
            </div>
            <div
              className="remove"
              onClick={() => {
                removeCartItem()
              }}
            >
              <span className="material-symbols-outlined">delete</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
