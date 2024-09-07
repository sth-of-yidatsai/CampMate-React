import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Rating from '@mui/material/Rating'
import styles from './home-ground-area.module.css'
import FavoriteBtn from '@/components/favorite-btn/favorite-btn-ground'
import { LiaTimesSolid } from 'react-icons/lia'
import MapIcon from '@/public/home-icons/mapIcon.svg'
import TopIcon from '@/public/home-icons/topIcon.svg'

// MUI Modal
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

// Google MAP
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import SingleMarker from '@/components/google-map/single-marker'

export default function HomeGroundArea({ isTransitioning }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [exitingImageIndex, setExitingImageIndex] = useState(null)
  const [selectedCard, setSelectedCard] = useState(1)
  const groundIds = [4, 5, 6] // 指定的露營地ID
  const [camps, setCamps] = useState([]) // 用於存儲從後端獲取的3個露營地的數據

  const [open, setOpen] = useState(false) // 控制地圖 Modal 的開關
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    async function fetchCamps() {
      try {
        const response = await fetch(
          `http://localhost:3005/api/home/campground?ids=${groundIds.join(',')}`
        )
        const data = await response.json()
        if (data.status === 'success') {
          setCamps(data.ground_data)
        } else {
          console.error('Failed to fetch camps:', data.msg)
        }
      } catch (error) {
        console.error('Error fetching camps:', error)
      }
    }
    fetchCamps()
  }, [])

  const currentCamp = camps[selectedCard - 1]

  // 計算當前露營地的平均評分，並四捨五入到小數點後一位
  let calc_avg_rating = currentCamp?.avg_rating
    ? (Math.round(Number(currentCamp.avg_rating) * 10) / 10).toFixed(1)
    : '0.0'

  useEffect(() => {
    if (isTransitioning || !currentCamp || !currentCamp.campImg) return

    const interval = setInterval(() => {
      setExitingImageIndex(currentImageIndex)
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % currentCamp.campImg.length
      )
    }, 5500)

    return () => clearInterval(interval)
  }, [currentImageIndex, currentCamp, isTransitioning])

  if (!currentCamp) return null

  const position = currentCamp.geolocation
    ? {
        lat: parseFloat(currentCamp.geolocation.split(',')[0]),
        lng: parseFloat(currentCamp.geolocation.split(',')[1]),
      }
    : { lat: 23.8, lng: 121.4 }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapArea}>
          <h2 className={styles.pageTitle}>
            <span className={styles.h2}>本月 TOP 3 露營區。</span>
            現在就來看看最美的露營區。
          </h2>
          <div className={styles.topRateArea}>
            <div className={styles.aside}>
              <div className={styles.displayInfo}>
                <div className={styles.nameWrap}>
                  <div className={styles.topNumber}>
                    <Image src={TopIcon} alt="" layout="fill" />
                    <p>{selectedCard}</p>
                  </div>
                  <p className={styles.cardTitle}>
                    {currentCamp.campground_name}
                  </p>
                </div>
                <div className={styles.category}>
                  <div className={`${styles.tag} ${styles.tagBg1}`}>
                    {currentCamp.area}
                  </div>
                  <div className={`${styles.tag} ${styles.tagBg2}`}>
                    海拔 {currentCamp.altitude} 公尺
                  </div>
                </div>
              </div>
              <div className={styles.cards}>
                {camps.map((camp, index) => (
                  <div
                    key={camp.id}
                    className={`${styles.card} ${
                      index + 1 === selectedCard ? styles.active : ''
                    }`}
                    onClick={() => setSelectedCard(index + 1)}
                  >
                    <div className={styles.cardTop}>TOP {index + 1}</div>
                    {camp.campImg && camp.campImg.length > 0 && (
                      <Image
                        src={camp.campImg[0]} // 使用正確的圖片路徑
                        alt={camp.campground_name}
                        layout="fill"
                        objectFit="cover"
                        className={styles.cardImage}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.carousel}>
              <div className={styles.icons} key={selectedCard}>
                <FavoriteBtn
                  className={styles.icons}
                  campgroundId={currentCamp.id}
                />
                <Image onClick={handleOpen} src={MapIcon} alt="Map Icon" />
              </div>
              <div className={styles.ratingWrapper}>
                <span className={styles.rating}>{calc_avg_rating}</span>
                <Rating
                  name="read-only"
                  value={Number(calc_avg_rating)} // 將字符串轉換為數字，以便 Rating 正常工作
                  readOnly
                  precision={0.1}
                  sx={{
                    color: '#e49366',
                  }}
                />
                <span className={styles.commentCount}>
                  {currentCamp.total_comment} 則評論
                </span>
              </div>
              <Link href={`/campground/detail?id=${currentCamp.id}`}>
                {currentCamp.campImg &&
                  currentCamp.campImg.map((image, index) => (
                    <div
                      key={index}
                      className={`${styles.image} ${
                        index === currentImageIndex ||
                        (isTransitioning && index === exitingImageIndex)
                          ? styles.visible
                          : ''
                      } ${
                        index === exitingImageIndex && !isTransitioning
                          ? styles.exiting
                          : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
              </Link>
            </div>
          </div>
        </div>

        {/* Modal for map */}
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
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '30px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            <button
              style={{
                position: 'absolute',
                zIndex: 999,
                right: '-20px',
                top: '-20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--main-color-bright)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                outline: 'none',
                border: 'none',
              }}
              onClick={handleClose}
            >
              <LiaTimesSolid />
            </button>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '30px',
                overflow: 'hidden',
              }}
            >
              <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <Map
                  mapTypeControl={true}
                  defaultCenter={position}
                  defaultZoom={15}
                  mapId={'739af084373f96fe'}
                  mapTypeId={'roadmap'}
                  gestureHandling={'auto'}
                  disableDefaultUI={true}
                >
                  <SingleMarker
                    position={position}
                    campground={currentCamp}
                    rooms={currentCamp.rooms}
                    totalComment={currentCamp.total_comment}
                  />
                </Map>
              </APIProvider>
            </div>
          </Box>
        </Modal>
      </div>
      <style jsx>
        {`
           {
            /* Modal */
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
          .map-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 30px;
            overflow: hidden;
          }
          .checkCommentBtn {
            color: var(--hint-color);
            cursor: pointer;
          }
          .allComment-wrapper {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 13px;
          }
        `}
      </style>
    </>
  )
}
