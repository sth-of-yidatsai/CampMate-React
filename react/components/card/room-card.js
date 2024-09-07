import { useState, useEffect } from 'react'
import { useSearch } from '@/hooks/use-search'
import '@csstools/normalize.css'
import { useRouter } from 'next/router'

// ICONS
import { MdPeople, MdOutlineSmokeFree, MdBed } from 'react-icons/md'
import { FaRegCalendar } from 'react-icons/fa'
import { FaRestroom } from 'react-icons/fa'
import { MdOutlineShower } from 'react-icons/md'
import { LuRefrigerator } from 'react-icons/lu'
import { LuSnowflake } from 'react-icons/lu'
import { PiHairDryerBold } from 'react-icons/pi'
import { PiTelevisionSimple } from 'react-icons/pi'
import { LuSofa } from 'react-icons/lu'
import { LiaTimesSolid } from 'react-icons/lia'
import { GiCoffeeCup } from 'react-icons/gi'
import { FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6'

// MUI Modal
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

//
import RoomCardCarousel from '../carousel/room-card-carousel'

export default function RoomCard({
  room,
  roomImg,
  roomSlidesCount,
  isLoading,
  campground_name,
  campground_img,
  campground_id,
}) {
  const {
    id,
    room_name,
    bed_type,
    room_people,
    price_per_day,
    refund,
    food,
    internet,
    parking_lot,
  } = room
  const { calenderValue, timeDifference, people } = useSearch()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const endDate = new Date(calenderValue.split('~')[1])
  endDate.setDate(endDate.getDate() + 7)

  const year = endDate.getFullYear()
  const month = (endDate.getMonth() + 1).toString().padStart(2, '0')
  const day = endDate.getDate().toString().padStart(2, '0')

  // 格式化日期
  const formattedDate = `${year}-${month}-${day}`

  // Room state
  const filteredRoomImg = roomImg
    .filter((img) => img.room_id === id)
    .map((img) => img.path)

  // Carousel
  const OPTIONS = { loop: true }
  const SLIDE_COUNT = filteredRoomImg.length
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  // 紀錄選取天數以及人數到 localStorage
  const router = useRouter()
  const handleOrderRecord = () => {
    localStorage.setItem(
      'orderInfo',
      JSON.stringify({
        campground_id: campground_id,
        campground_name: campground_name,
        campground_img: campground_img,
        room_id: id,
        room_name: room_name,
        room_img: filteredRoomImg[0],
        checkInDate: calenderValue.split('~')[0],
        checkOutDate: calenderValue.split('~')[1],
        people: people,
        pay_amount: price_per_day * timeDifference,
        refund: refund,
        r_deadline: formattedDate,
        night: timeDifference,
      })
    )

    router.push('/campground/order')
  }
  return (
    <>
      <div className="card-wrapper">
        <div className="room-name">{room_name}</div>
        <div className="title-wrapper">
          <div className="info">
            <div className="info-title">房型資訊</div>
            <div className="info-content">
              <img className="room-image" src={campground_img} alt="" />
              <div className="room-info-wrapper">
                <MdPeople style={{ width: '24px', height: '24px' }} />
                基本入住人數:{room_people}人
              </div>
              <div className="room-info-wrapper">
                <MdOutlineSmokeFree style={{ width: '24px', height: '24px' }} />
                禁菸房
              </div>
              <div className="room-info-wrapper">
                <MdBed style={{ width: '24px', height: '24px' }} />
                {bed_type}
              </div>
              <div>
                <button className="checkBtn" onClick={handleOpen}>
                  查看房型資訊
                </button>
              </div>
              {/* 這裡是我的 Modal */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1200,
                    height: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: '30px',
                    outline: 'none',
                    display: 'flex',
                    paddingInline: '40px',
                    paddingTop: '20px',
                    paddingBottom: '35px',
                    flexDirection: 'column',
                    alignItems: 'start',
                    gap: '40px',

                    '&::-webkit-scrollbar': {
                      width: '8px', // 设置滚动条宽度
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888', // 滚动条颜色
                      borderRadius: '30px', // 滚动条圆角
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#555',
                    },
                  }}
                >
                  <button className="times" onClick={handleClose}>
                    <LiaTimesSolid />
                  </button>
                  <div className="box-wrapper">
                    <div className="box-content-title">房型圖片</div>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : roomImg && roomSlidesCount > 0 ? (
                      <RoomCardCarousel
                        slides={SLIDES}
                        options={OPTIONS}
                        filteredRoomImg={filteredRoomImg}
                      />
                    ) : (
                      <div>No data available.</div>
                    )}

                    <div className="box-content-title">設施</div>
                    <div className="facility-wrapper">
                      <div className="facility">
                        <FaRestroom />
                        廁所
                      </div>
                      <div className="facility">
                        <MdOutlineShower />
                        衛浴
                      </div>
                      <div className="facility">
                        <LuRefrigerator />
                        冰箱
                      </div>
                      <div className="facility">
                        <LuSnowflake />
                        冷氣
                      </div>
                      <div className="facility">
                        <PiHairDryerBold />
                        吹風機
                      </div>
                      <div className="facility">
                        <PiTelevisionSimple />
                        電視
                      </div>
                      <div className="facility">
                        <MdBed />床
                      </div>
                      <div className="facility">
                        <LuSofa />
                        沙發
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
          <div className="info2">
            <div className="info-title">訂房方案</div>
            <div className="middle-wrapper">
              <div className="mid-top-wrapper">
                <div className="room-type">專案與優惠</div>
                {food ? (
                  <div className="cancel">
                    <GiCoffeeCup style={{ marginBottom: '5px' }} /> 附{food}
                  </div>
                ) : (
                  ''
                )}
                {refund ? (
                  <div className="cancel">
                    <FaCircleCheck style={{ marginBottom: '5px' }} />{' '}
                    {formattedDate} 前可免費取消
                  </div>
                ) : (
                  <div className="cancel">
                    <FaTriangleExclamation style={{ marginBottom: '5px' }} />{' '}
                    訂房後無法退款
                  </div>
                )}
              </div>
              <div className="specail-service">
                {parking_lot ? (
                  <div className="service-text">免費自助停車</div>
                ) : (
                  ''
                )}
                {internet ? (
                  <div className="service-text">免費無線上網</div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className="info3">
            <div className="info-title3">總價</div>
            <div className="total-count">
              <div className="room-info-wrapper">
                <MdPeople style={{ width: '24px', height: '24px' }} />
                {room_people} 人
              </div>
              <div className="room-info-wrapper">
                <FaRegCalendar style={{ width: '24px', height: '24px' }} />
                {timeDifference} 晚
              </div>
              <div className="bottom-wrapper">
                <div className="room-price">
                  $ {price_per_day * timeDifference}
                </div>
                <div className="order-btn-wrapper">
                  <div className="order-btn" onClick={handleOrderRecord}>
                    預約訂房
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          div.card-wrapper {
            width: 1042px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            margin-bottom: 40px;
          }
          div.middle-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            height: 100%;
            borderright: 1px solid #574426;
            marginbottom: 10px;
          }
          div.mid-top-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          div.room-name {
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            background-color: var(--main-color-dark);
            color: var(--main-color-bright);
            padding-left: 35px;
            padding-block: 10px;
          }
          div.title-wrapper {
            padding-inline: 35px;
            display: flex;
          }
          div.info {
            display: flex;
            flex-direction: column;
            width: 185px;
            font-family: 'Noto Sans TC', sans-serif;
            font-size: 12px;
            color: var(--main-color-dark);
          }
          div.info-title {
            font-size: 12px;
            font-weight: 500;
            color: #8f8e93;
            border-bottom: 1px solid #574426;
            padding-right: 10px;
            padding-block: 10px;
            margin-bottom: 0;
          }

          div.info-title3 {
            font-size: 12px;
            font-weight: 500;
            color: #8f8e93;
            border-bottom: 1px solid #574426;
            padding-right: 10px;
            padding-block: 10px;
            margin-bottom: 0;
          }
          div.info-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 16px;
            padding-block: 10px;
            padding-right: 10px;
            border-right: 1px solid #574426;
            margin-bottom: 10px;
          }
          button.checkBtn {
            font-size: 14px;
            padding-inline: 15px;
            padding-block: 5px;
            background: #e5e4cf;
            outline: inherit;
            border-radius: 40px;
            border: 1px solid var(--main-color-dark);
            font-family: 'Noto Sans TC';
            font-weight: 500;
            color: #574426;
            cursor: pointer;
          }
          div.info2 {
            display: flex;
            flex-direction: column;
            width: 482px;
            font-family: 'Noto Sans TC', sans-serif;
          }
          div.room-type {
            font-family: 'Noto Sans TC', sans-serif;
            font-size: 30px;
            font-weight: 500;
            color: var(--main-color-dark);
          }
          div.cancel {
            font-family: 'Noto Sans TC', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--hint-color);
          }

          div.cancel2 {
            font-family: 'Noto Sans TC', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: #e32453;
          }
          div.specail-service {
            font-family: 'Noto Sans TC', sans-serif;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            font-weight: 500;
            color: var(--main-color-dark);
          }

          div.info3 {
            display: flex;
            flex-direction: column;
            width: 340px;
            font-family: 'Noto Sans TC', sans-serif;
          }
          div.room-info-wrapper {
            display: flex;
            gap: 12px;
            align-items: center;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-weight: 500;
            color: var(--main-color-dark);
          }
          div.total-count {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          div.total-count .room-price {
            font-family: 'Montserrat';
            font-size: 40px;
            font-style: normal;
            font-weight: 600;
            color: var(--main-color-dark);
          }
          img.room-image {
            width: 175px;
            height: 175px;
            object-fit: cover;
          }
          div.order-btn-wrapper {
            display: flex;
            justify-content: end;
          }
          div.order-btn {
            background: var(--main-color-dark);
            color: var(--main-color-bright);
            padding-inline: 25px;
            padding-block: 12px;
            border-radius: 40px;
            cursor: pointer;
          }
          .bottom-wrapper {
            margin-top: 180px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
           {
            /* modal */
          }

          div.box-content-title {
            width: 100%;
            background: var(--main-color-dark);
            border-radius: 35px;
            padding: 6px 20px 6px 20px;
            color: var(--main-color-bright);
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            margin-bottom: 16px;
          }
          div.facility-wrapper {
            display: flex;
            gap: 17px;
            padding-left: 10px;
          }
          div.facility {
            display: flex;
            gap: 5px;
            align-items: center;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            color: #2d2d2d;
          }
          .times {
            position: absolute;
            z-index: 999;
            right: -20px;
            top: -20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--main-color-bright);
            display: grid;
            place-items: center;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            outline: none;
            border: none;
          }
          .times:hover {
            background: var(--hint-color);
            cursor: pointer;
          }
          .box-wrapper {
            padding: 20px;
            width: 100%;
            height: 100%;
            overflow-y: auto;
          }
        `}
      </style>
    </>
  )
}
