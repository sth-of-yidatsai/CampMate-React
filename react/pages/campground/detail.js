import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSearch } from '@/hooks/use-search'
import { useAuthTest } from '@/hooks/use-auth-test'
import Link from 'next/link'
import '@csstools/normalize.css'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import TrainMarker from '@/components/google-map/train-marker'
import AttractionMarker from '@/components/google-map/attraction-marker'

// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Rating from '@mui/material/Rating'
import VerticalCarousel from '@/components/carousel/verticalCarousel'
import RoomCard from '@/components/card/room-card'
import CommentCard from '@/components/card/comment-card'
import InputBarRoom from '@/components/inputbar/inputBar-room'

// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'
import { IoLocationOutline } from 'react-icons/io5'
import { LiaTimesSolid } from 'react-icons/lia'
import { FaRegHeart } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa6'
import { LuPalmtree } from 'react-icons/lu'
//MUI progress bar
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
// Drawer
import Drawer from '@mui/material/Drawer'
// Skeleton
import Skeleton from '@mui/material/Skeleton'

import Top_btn from '@/components/tian/common/top_btn'

// Google MAP
import HotelMap from '@/components/google-map/hotel-map'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import SingleMarker from '@/components/google-map/single-marker'

// 解決Hydration問題
import dynamic from 'next/dynamic'
import { all } from 'axios'
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

// MUI Modal
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

export default function Detail() {
  const { people } = useSearch()
  const router = useRouter()
  const { auth } = useAuthTest()
  const [isLoading, setIsLoading] = useState(true)
  const [campground, setCampground] = useState({
    id: 1,
    campground_name: '',
    email: '',
    address: '',
    phone: '',
    title_img_path: '',
    campground_introduction: '',
    altitude: 0,
    city: '',
    area: '',
    geolocation: '',
    campground_owner_id: 0,
    avg_rating: '',
  })
  const [totalComment, setTotalComment] = useState(0)
  const [allRating, setAllRating] = useState([])
  const [rooms, setRooms] = useState([])
  const [campgroundImg, setCampgroundImg] = useState([])
  const [slidesCount, setSlidesCount] = useState(0)
  const [roomImg, setRoomImg] = useState([])
  const [roomSlidesCount, setRoomSlidesCount] = useState(0)
  const [position, setPosition] = useState({ lat: 23.8, lng: 121.4 })
  const [trainPos, setTrainPos] = useState({ lat: 23.8, lng: 121.4 })
  const [attraction, setAttraction] = useState([])

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'GROUND', href: '/campground/campground-list' },
    {
      name: campground.campground_name,
      href: `/campground/detail?id=${campground.id}`,
    },
  ]

  // fetch 營地詳細資料
  const getCampground = async (cid) => {
    const url = 'http://localhost:3005/api/campground/' + cid
    try {
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 'success') {
        // console.log(result.data.campground)
        setCampground(result.data.campground)

        const pos = result.data.campground.geolocation
        const latCur = Number(pos.split(',')[0])
        const lngCur = Number(pos.split(',')[1])
        setPosition({ lat: latCur, lng: lngCur })
        console.log({ lat: latCur, lng: lngCur })

        setTotalComment(result.data.total_comment)

        if (Array.isArray(result.data.campImg)) {
          setCampgroundImg(
            result.data.campImg.map((item) => ({
              src: item.path,
            }))
          )
          setSlidesCount(result.data.campImg.length)
        }

        if (Array.isArray(result.data.rating)) {
          setAllRating(result.data.rating)
        }
        if (Array.isArray(result.data.rooms)) {
          setRooms(result.data.rooms)
        }
        if (Array.isArray(result.data.roomImg)) {
          setRoomImg(result.data.roomImg)
          setRoomSlidesCount(result.data.roomImg.length)
        }

        // 加載動畫 1.5 秒
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false) // 确保在错误时也关闭加载动画
    }
  }

  const getRoom = async (cid, people) => {
    setIsLoading(true)
    const url = `http://localhost:3005/api/campground/${cid}/room?people=${people}`
    try {
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 'success') {
        if (Array.isArray(result.data.rooms)) {
          setRooms(result.data.rooms)
        }

        // 加載動畫 1.5 秒
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false) // 确保在错误时也关闭加载动画
    }
  }

  const getTrainPos = async (city) => {
    setIsLoading(true)
    const url = `http://localhost:3005/api/camp-train/${city}`
    try {
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 'success') {
        if (Array.isArray(result.data.train_station)) {
          const pos = result.data.train_station[0].geolocation
          const latCur = Number(pos.split(',')[0])
          const lngCur = Number(pos.split(',')[1])
          setTrainPos({ lat: latCur, lng: lngCur })
        }

        // 加載動畫 1.5 秒
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false) // 确保在错误时也关闭加载动画
    }
  }

  // 新增至收藏 的愛心變化（實心空心）
  const [like, setLike] = useState(false)

  // 更新收藏狀況
  const postFavorite = async () => {
    if (!auth.isAuth) {
      notifyFav()
      return
    }
    // 开始动画
    setAnimate(true)
    try {
      const response = await fetch(
        'http://localhost:3005/api/campground/collect',
        {
          method: 'POST',
          credentials: 'include', // 包含 cookies 和其他認證資訊
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: 1, campground_id: router.query.id }),
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      if (result.message === 'Favorite removed') {
        setLike(false)
      } else {
        setLike(true)
      }
      console.log(result.message)
    } catch (error) {
      console.error('Error processing favorite request:', error)
    }
    // 确保动画播放完整
    setTimeout(() => {
      setAnimate(false)
    }, 1200)
  }

  // SweetAlert
  const MySwal = withReactContent(Swal)
  const notifyFav = () => {
    MySwal.fire({
      title: '需要登入後才能將營地加入收藏喲!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    })
  }

  // 抓取收藏狀況
  const fetchFavoriteStatus = async (cid) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/campground/collect/` + cid,
        {
          credentials: 'include', // 包含 cookies 和其他認證資訊
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      setLike(result.like)
    } catch (error) {
      console.error('Error fetching favorite status:', error)
    }
  }
  // 收藏按鈕click動畫
  const [animate, setAnimate] = useState(false)

  // const FavBtnClick = (e) => {
  //   e.preventDefault()
  //   setAnimate(true)

  //   setTimeout(() => {
  //     setAnimate(false)
  //   }, 700)
  // }

  const fetchAttraction = async (cid) => {
    setIsLoading(true)
    const url = `http://localhost:3005/api/camp-attraction/${cid}`
    try {
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 'success') {
        if (Array.isArray(result.data.attraction)) {
          setAttraction(result.data.attraction)
        }

        // 加載動畫 1.5 秒
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false) // 确保在错误时也关闭加载动画
    }
  }

  // 抓距離多遠
  const fetchDistance = async (origins, destinations) => {
    // const origins = '23.4791004,120.4413128' // 假設這是你的起點坐標
    // const destinations = '24.136855,120.686831' // 終點坐標
    const url = `http://localhost:3005/api/camp-attraction/distance?origins=${origins}&destinations=${destinations}`

    try {
      const response = await fetch(url, {
        credentials: 'include', // 包含 cookies 和其他認證資訊
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      if (data.status === 'OK') {
        const distanceText = data.rows[0]?.elements[0]?.distance?.text
        console.log(`Distance ${distanceText}`)
      } else {
        console.log(`Error in API response: ${data.status}`)
      }
    } catch (error) {
      console.log(`Error fetching distance: ${error.message}`)
    }
  }

  // const fetchDistance = async () => {
  //   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //   const origins = '23.4791004,120.4413128' // 假設這是你的起點坐標
  //   const destinations = '24.136855,120.686831' // 終點坐標
  //   const url = `https://maps.googleapis.com/maps/api/distance?origins=${origins}&destinations=${destinations}&key=${apiKey}`

  //   try {
  //     const response = await fetch(url, {
  //       credentials: 'include', // 包含 cookies 和其他認證資訊
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': 'https://localhost:3000',
  //       },
  //     })
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`)
  //     }
  //     const data = await response.json()
  //     if (data.status === 'OK') {
  //       const distanceText = data.rows[0]?.elements[0]?.distance?.text
  //       console.log(`Distance ${distanceText}`)
  //     } else {
  //       console.log(`Error in API response: ${data.status}`)
  //     }
  //   } catch (error) {
  //     console.log(`Error fetching distance: ${error.message}`)
  //   }
  // }

  useEffect(() => {
    if (router.isReady) {
      // console.log(router.query.id)
      getCampground(router.query.id)
      getRoom(router.query.id, people)
      fetchFavoriteStatus(router.query.id)
      fetchAttraction(router.query.id)
      // fetchDistance()
    }

    // 以下為省略eslint檢查一行
    // eslint-disable-next-line
  }, [router.isReady])

  useEffect(() => {
    getTrainPos(campground.city)
  }, [campground])

  //計算平均
  let calc_avg_rating = (
    Math.round(Number(campground.avg_rating) * 10) / 10
  ).toFixed(1)

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // Carousel
  const OPTIONS = { loop: true }
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  // Progress Bar
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      border: '1px solid #E49366',
      backgroundColor: '#E5E4CF',
    },
    [`& .${linearProgressClasses.bar}`]: {
      border: '1px solid #E49366',
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#E49366' : '#E5E4CF',
    },
  }))

  let score5 = 0
  let score4 = 0
  let score3 = 0
  let score2 = 0
  let score1 = 0
  let totalCount = 0
  allRating.map((row, i) => {
    switch (row.rating) {
      case 1:
        score1 += 1
        totalCount += 1
        break
      case 2:
        score2 += 1
        totalCount += 1
        break
      case 3:
        score3 += 1
        totalCount += 1
        break
      case 4:
        score4 += 1
        totalCount += 1
        break
      case 5:
        score5 += 1
        totalCount += 1
        break
    }
  })
  let scoreArr = [score5, score4, score3, score2, score1]

  // 為了控制 scrollTo
  const sec0Ref = useRef(null)
  const sec1Ref = useRef(null)
  const sec2Ref = useRef(null)
  const sec3Ref = useRef(null)
  const sec4Ref = useRef(null)
  const sec5Ref = useRef(null)
  const sec6Ref = useRef(null)
  const scrollToItem = (ref, offset = -64) => {
    const elementPosition =
      ref.current.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition + offset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
  // 打開地圖
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // 打開評論側欄
  const [openDrawer, setOpenDrawer] = useState(false)
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen)
  }

  return (
    <>
      <div className="body" ref={sec0Ref}>
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

        <main
          style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            maxWidth: '1440px',
            margin: '24px auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              marginInline: '80px',
            }}
          >
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
                {' '}
                <button className="times" onClick={handleClose}>
                  <LiaTimesSolid />
                </button>
                <div className="map-wrapper">
                  <APIProvider
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  >
                    <Map
                      mapTypeControl={true}
                      defaultCenter={position}
                      defaultZoom={12}
                      mapId={'739af084373f96fe'}
                      mapTypeId={'roadmap'}
                      gestureHandling={'auto'}
                      disableDefaultUI={true}
                    >
                      <SingleMarker
                        position={position}
                        campground={campground}
                        rooms={rooms}
                        totalComment={totalComment}
                      />
                      <TrainMarker
                        attaction_position={trainPos}
                        city={campground.city}
                      />
                      {attraction.map((att, i) => {
                        return (
                          <AttractionMarker
                            key={i}
                            attraction_pos={att.geolocation}
                            att_name={att.attaction_name}
                          />
                        )
                      })}
                    </Map>
                  </APIProvider>
                </div>
              </Box>
            </Modal>

            <div className="bread-crumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="detail-title">
              <h1>
                {campground.campground_name}
                <span></span>
              </h1>
              <div className="favorite" onClick={postFavorite}>
                <button
                  className={`favBtn ${animate ? 'animate' : ''}`}
                  // onClick={FavBtnClick}
                >
                  {like ? (
                    <>
                      <FaHeart style={{ color: 'var(--hint-color)' }} />
                      <span className="favText">收藏</span>{' '}
                    </>
                  ) : (
                    <>
                      {' '}
                      <FaRegHeart />
                      <span className="favText">收藏</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="ratingWrapper">
              <span className="rating">{calc_avg_rating}</span>
              <Rating
                name="size-large"
                value={calc_avg_rating}
                precision={0.1}
                readOnly
                sx={{
                  color: '#e49366',
                }}
              />
              <span className="commentCount">{totalComment} 則評論</span>
            </div>
            <div className="location-wrapper">
              <div className="locationLabel">
                <IoLocationOutline
                  style={{
                    width: '20px',
                    height: '20px',
                    position: 'relative',
                    bottom: '2',
                    color: '#e49366',
                  }}
                />
              </div>
              <span>{campground.address}</span>
              <div onClick={handleOpen}>查看地圖</div>
            </div>
            {isLoading ? (
              <div className="sk-wrapper">
                <div className="leftsk-wrapper">
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={800}
                    height={494}
                    sx={{ borderRadius: '20px' }}
                  />
                </div>
                <div className="vertical-wrapper">
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={205}
                    height={97}
                    sx={{ borderRadius: '20px' }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={205}
                    height={97}
                    sx={{ borderRadius: '20px' }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={205}
                    height={97}
                    sx={{ borderRadius: '20px' }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={205}
                    height={97}
                    sx={{ borderRadius: '20px' }}
                  />
                </div>
              </div>
            ) : campgroundImg && slidesCount > 0 ? (
              <VerticalCarousel
                slides={SLIDES}
                options={OPTIONS}
                campgroundImg={campgroundImg}
              />
            ) : (
              <div>No data available.</div>
            )}

            <div className="navbar-detail">
              <button
                className="navbar-item item1"
                onClick={() => scrollToItem(sec1Ref)}
              >
                簡介
              </button>
              <button
                className="navbar-item"
                onClick={() => scrollToItem(sec2Ref)}
              >
                房型
              </button>
              {/* <button
                className="navbar-item"
                onClick={() => scrollToItem(sec3Ref)}
              >
                地點
              </button> */}
              <button
                className="navbar-item"
                onClick={() => scrollToItem(sec4Ref)}
              >
                附近景點
              </button>
              <button
                className="navbar-item"
                onClick={() => scrollToItem(sec5Ref)}
              >
                評價
              </button>
              <button
                className="navbar-item"
                onClick={() => scrollToItem(sec6Ref)}
              >
                入住規範
              </button>
            </div>
            <div
              className="content-wrapper nav-title"
              style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}
            >
              <div
                className="introduciton"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec1Ref}
              >
                <h1>旅宿簡介</h1>
                <hr />
                <div
                  dangerouslySetInnerHTML={{
                    __html: campground.campground_introduction,
                  }}
                />
              </div>
              <div
                className="room-type"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec2Ref}
              >
                <h1>房型</h1>
                <hr />
                <div>
                  <InputBarRoom
                    getRoom={getRoom}
                    campground_id={campground.id}
                  />
                </div>
                {isLoading ? (
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={1042}
                    height={439}
                    sx={{ borderRadius: '20px' }}
                  />
                ) : (
                  rooms.map((room, i) => {
                    return (
                      <RoomCard
                        key={i}
                        room={room}
                        roomImg={roomImg}
                        roomSlidesCount={roomSlidesCount}
                        isLoading={isLoading}
                        campground_name={campground.campground_name}
                        campground_img={campground.title_img_path}
                        campground_id={campground.id}
                      />
                    )
                  })
                )}
              </div>
              {/* <div
                className="location-title"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec3Ref}
              >
                <h1>地點</h1>
                <hr />
                <div className="location-wrapper">
                  <div className="locationLabel">
                    <IoLocationOutline
                      style={{
                        width: '20px',
                        height: '20px',
                        position: 'relative',
                        bottom: '2',
                        color: '#e49366',
                      }}
                    />
                  </div>
                  <span>{campground.address}</span>
                  <div>查看地圖</div>
                </div>
              </div> */}
              <div
                className="near-spot-title"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec4Ref}
              >
                <h1>附近景點</h1>
                <hr />
                {attraction.map((att, i) => {
                  return (
                    <div key={i} className="attraction">
                      <LuPalmtree />
                      {att.attaction_name}
                      <div className="attraction2">
                        <div className="attraction2">距離</div>
                        {att.distance}
                      </div>
                    </div>
                  )
                })}
                <div className="checkCommentBtn" onClick={handleOpen}>
                  查看附近地標
                </div>
              </div>
              <div
                className="rating-title"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec5Ref}
              >
                <div
                  style={{ display: 'flex', postion: 'relative', gap: '10px' }}
                >
                  <h1>評價</h1>
                  <div className="ratingWrapper">
                    <span className="rating2">{calc_avg_rating}</span>
                    <Rating
                      name="size-large"
                      value={calc_avg_rating}
                      readOnly
                      sx={{
                        color: '#e49366',
                      }}
                    />
                    <span className="commentCount">{totalComment} 則評論</span>
                  </div>
                </div>
                <hr />
                <div className="rating-content-wrapper">
                  <div className="scorebar-wrapper">
                    {scoreArr.map((v, index) => {
                      return (
                        <div className="score-wrapper" key={index}>
                          <Rating
                            key={index}
                            name="size-medium"
                            size="small"
                            value={scoreArr.length - index}
                            readOnly
                            sx={{
                              color: '#e49366',
                            }}
                          />
                          <div className="progress-bar">
                            <BorderLinearProgress
                              variant="determinate"
                              value={Math.floor((v / totalCount) * 100)}
                            />
                          </div>
                          <span className="score-font">{v}</span>
                        </div>
                      )
                    })}
                  </div>
                  {allRating
                    .filter((_, i) => i < 2)
                    .map((comment, i) => {
                      return (
                        <div key={i}>
                          <CommentCard comment={comment} />
                        </div>
                      )
                    })}
                  <div className="checkCommentBtn" onClick={toggleDrawer(true)}>
                    查看更多評論
                  </div>
                  <Drawer
                    open={openDrawer}
                    onClose={toggleDrawer(false)}
                    anchor={'right'}
                  >
                    <div className="allComment-wrapper">
                      <span>所有評論，共 {totalComment} 則</span>
                      {allRating.map((comment, i) => {
                        return (
                          <div key={i}>
                            <CommentCard comment={comment} />
                          </div>
                        )
                      })}
                    </div>
                  </Drawer>
                </div>
              </div>
              <div
                className="rule-title"
                style={{ width: '1024px', margin: 'auto' }}
                ref={sec6Ref}
              >
                <h1>入住規範</h1>
                <hr />
                <div>{campground.restriction}</div>
              </div>
            </div>
          </div>
        </main>
        <Top_btn />
        {isDesktopOrLaptop && <Footer />}
        {isTabletOrMobile && <FooterM />}
      </div>
      <style jsx>
        {`
          .detail-title {
            margin-block: 16px;
            font-family: 'Noto Sans TC', sans-serif;
            display:flex;
            justify-content:space-between;
            align-items:end;
            h1 {
              font-size: 36px;
              font-weight: 700;
              span {
                font-size: 24px;
                font-weight: 700;
              }
            }
          }
          .ratingWrapper {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .ratingWrapper2 {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .scorebar-wrapper{
            display: flex;
            flex-direction: column;
            gap: 13px;
            margin-bottom:20px;
          }
          .rating-content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 13px;
          }

          .rating {
            background: var(--hint-color);
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            padding: 5px;
            color: var(--main-color-bright);
            border-radius: 10px;
          }
          .rating2 {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: var(--main-color-dark);
            margin-right: 5px;
          }

          .location-wrapper {
            font-family: 'Noto Sans TC', sans-serif;
            margin-block: 16px;
            display: flex;
            gap: 10px;
            p {
              color: #8f8e93;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 0;
            }
            div {
              color: #e49366;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
            }
          }

          .commentCount {
            font-family: 'Noto Sans TC', sans-serif;
            color: #8f8e93;
            font-size: 12px;
          }

          .navbar-detail {
            display: flex;
            width: 100%;
            margin-bottom: 32px;
            border-bottom: 1px solid #8f8e93;
          }

          .navbar-item {
            width: 150px;
            font-family: 'Noto Sans TC', sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            padding-block: 16px;
            cursor: pointer;
            background: none;
            color: inherit;
            border: none;
            outline: inherit;
          }
          .navbar-item:hover {
            color: var(--hint-color);
            border-bottom: 3px solid var(--hint-color);
          }

          .item1 {
            border-bottom: 3px solid var(--main-color-dark);
          }
          .nav-title {
            h1 {
              font-family: 'Noto Sans TC';
              font-size: 20px;
              font-weight: 500;
            }
            div {
              font-family: 'Noto Sans TC';
              font-size: 14px;
              font-weight: 500;
              white-space: pre-wrap;
            }
          }
          .score-wrapper {
            display: flex;
            flex-direction : column
            align-items: center;
            gap: 17px;
          }
          .progress-bar {
            width: 163px;
          }
          .score-font {
            font-family: 'Noto Sans TC';
            font-size: 12px;
            font-style: normal;
            color: #8f8e93;
          }
          {/* Modal */}
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
          .map-wrapper{
            width:100%;
            height:100%;
            border-radius: 30px;
            overflow: hidden;
          }
          .attract-map{
            height:600px;
            width:100%;
          }
          div.checkCommentBtn{
            display:flex;
            justify-content:end;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
            color: var(--hint-color);
            cursor: pointer;
          }
          .allComment-wrapper{
            padding: 20px;
            display:flex;
            flex-direction: column;
            gap: 13px;
          }

          {/* Skeleton */}
          .sk-wrapper{
            display: flex;
            padding: 20px;
            margin-inline:auto;
            width:1165,;
            height:534;
          }
          .leftsk-wrapper{
            padding-right: 120px;
          }
          .vertical-wrapper{
            width:205px;
            height:450px;
            margin-top:20px;
            display: flex;
            flex-direction:column;
            gap:10px;
          }
          .favorite {
            font-size: 1.2rem;
            display: flex;
            align-items: start;
            cursor:pointer;
          }

          .favorite:hover {
            color: var(--hint-color);
          }

          .favBtn2{
            background: var(--sub-color);
            padding-inline: 15px;
            padding-block: 8px;
            border-radius:20px;
            display:flex;
            align-items:center;
            gap:10px;
          }
          .favBtn{
            width: 110px;
            background: var(--sub-color);
            padding-inline: 15px;
            padding-block: 8px;
            border-radius:20px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            border: none;
            cursor:pointer;
            position: relative;
            transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
            {/* box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5); */}
            
            &:focus {
              outline: 0;
            }
            
            &:before, &:after{
              position: absolute;
              content: '';
              display: block;
              width: 100%;
              height: 120%;
              left: -20%;
              z-index: -1000;
              transition: all ease-in-out 0.5s;
              background-repeat: no-repeat;
            }
            
            &:before{
              display: none;
              top: -75%;
              background-image:  
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
                radial-gradient(circle,  transparent 20%, var(--hint-color) 20%, transparent 30%),
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%), 
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
                radial-gradient(circle,  transparent 10%, var(--hint-color) 15%, transparent 20%),
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
                radial-gradient(circle, var(--hint-color) 20%, transparent 20%);
            background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
            background-position: 0% 80%, -5% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 85% 30%;
            }
            
            &:after{
              display: none;
              bottom: -75%;
              background-image:  
              radial-gradient(circle, var(--hint-color) 20%, transparent 20%), 
              radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
              radial-gradient(circle,  transparent 10%, var(--hint-color) 15%, transparent 20%),
              radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
              radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
              radial-gradient(circle, var(--hint-color) 20%, transparent 20%),
              radial-gradient(circle, var(--hint-color), transparent 20%);
            background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
            background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
            }
          
            &:active{
              transform: scale(0.9);
              background-color: darken(var(--hint-color), 5%);
              {/* box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2); */}
            }
            
            &.animate{
              &:before{
                display: block;
                animation: topBubbles ease-in-out 1.2s forwards;
              }
              &:after{
                display: block;
                animation: bottomBubbles ease-in-out 1.2s forwards;
              }
            }
          }


          @keyframes topBubbles {
            0%{
              background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
            }
              50% {
                background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;}
          100% {
              background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
            background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
            }
          }

          @keyframes bottomBubbles {
            0%{
              background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
            }
            50% {
              background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;}
          100% {
              background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
            background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
            }
          }

          .favText{
            font-family: 'Noto Sans TC';
              font-size: 16px;
              font-weight: 500;
          }

          div.attraction{
            display:flex;
            gap: 5px;
            align-items:center;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-weight: 500;
            margin:5px;
          }
          div.attraction2{
            display:flex;
            gap: 5px;
            align-items:center;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-weight: 400;
            margin:5px;
            color:#8f8e93;
          }
        `}
      </style>
    </>
  )
}
