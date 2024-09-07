import React, { useState, useEffect } from 'react'

import { useRentcart } from '@/hooks/use-rentcart'

import styles from './pickupModal.module.css'

export default function PickupModal({
  pickup,
  pickupToggle,
  setPickupToggle,
  addpickupToggle,
  setAddpickupToggle,
  pickupValue,
  setPickupValue,
  handleCheckPickup,
  pickupInfo,
}) {
  // 關閉變更取貨人視窗
  const closePickup = () => {
    if (pickupToggle === true) {
      setPickupToggle(false)
      return
    }
  }

  const resetPickup = () => {
    setPickupValue(pickupInfo.pickup_id)
  }

  const cleanPickup = () => {
    setPickupValue(null)
  }

  //----------------------------------------------------------------------

  const handleChange = (e) => {
    // 設置選中的 Radio Button 的值
    setPickupValue(e.target.value)
  }

  // 選取的 pickup 有變動時，設置選取的 pickup
  useEffect(() => {
    // const selected = pickup.find(
    //   (item) => item.pickup_id === Number(pickupValue)
    // )
    // if (selected) {
    // } else {
    //   console.log(`什麼也沒有`)
    // }
    // console.log(selected)
  }, [pickupValue])

  useEffect(() => {
    // if (pickupInfo) {
    //   setPickupValue(pickupInfo.pickup_id)
    // }
  }, [])

  //----------------------------------------------------------------------

  //------------------------------------------------------------------------

  const openAddpickup = () => {
    if (addpickupToggle === false) {
      setAddpickupToggle(true)
      setPickupToggle(false)
      return
    }
  }

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log(pickup)
  }, [pickup])

  return (
    <>
      <section
        className={`pickupModal-tian ${pickupToggle === false ? 'd-none' : ''}`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">變更取貨人</div>
          <div
            onClick={() => {
              closePickup()
              resetPickup()
            }}
            className="close"
          >
            <span className="material-symbols-outlined light-text-tian">
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="bodyHeader">
            <div className="bodyTitle h6-tc-tian dark-text-tian">
              選擇取貨人
            </div>
            <div onClick={openAddpickup} className="addPickup">
              <span className="material-symbols-outlined prompt-text-tian">
                add
              </span>
              <div className="p2-tc-tian prompt-text-tian">新增取貨人</div>
            </div>
          </div>
          <div className="content">
            {isClient &&
              pickup.map((item, i) => {
                return (
                  <React.Fragment key={item.pickup_id}>
                    <div
                      className={`pickupCard ${
                        Number(pickupValue) === item.pickup_id ? 'active' : ''
                      }`}
                    >
                      <div className="info">
                        <div className="name p2-tc-tian">
                          姓名/ <span>{item.full_name}</span>
                          {item.default_num == 1 && (
                            <span
                              style={{
                                paddingBlock: '2px',
                                paddingInline: '8px',
                                borderRadius: '10px',
                              }}
                              className="p3-tc-tian light-text-tian prompt-bg-tian mx-2"
                            >
                              預設
                            </span>
                          )}
                        </div>
                        <div className="phone p2-tc-tian">
                          電話/ <span>{item.phone}</span>
                        </div>
                        <div className="email p2-tc-tian">
                          Email/ <span>{item.email}</span>
                        </div>
                      </div>
                      <div className="circleCheck">
                        <label className={styles.container}>
                          <input
                            type="checkbox"
                            name="radio"
                            value={item.pickup_id}
                            checked={Number(pickupValue) === item.pickup_id}
                            onChange={handleChange}
                          />
                          <span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
          </div>
        </div>
        <div className="footer">
          <div>
            <button
              className="cancel btn primary2-outline-btn-tian p1-tc-tian"
              onClick={() => {
                closePickup()
                resetPickup()
              }}
            >
              取消
            </button>
            <button
              className="confirm btn primary2-btn-tian p1-tc-tian"
              onClick={() => {
                closePickup()
                handleCheckPickup()
              }}
            >
              確認
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
