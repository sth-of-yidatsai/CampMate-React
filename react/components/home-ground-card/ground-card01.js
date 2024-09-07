import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ground-card01.module.css'
import Rating from '@mui/material/Rating'
import { LiaTimesSolid } from 'react-icons/lia'
import { MdKeyboardControlKey } from 'react-icons/md'
import { IoLocationOutline } from 'react-icons/io5'
import { MdOutlineArrowOutward } from 'react-icons/md'
import FavoriteBtn from '@/components/favorite-btn/favorite-btn-ground'
import MapIcon from '@/public/home-icons/mapIcon.svg'

// MUI Modal
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

// Google MAP
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import SingleMarker from '@/components/google-map/single-marker'

export default function GroundCard01({ camp, rooms = [] }) {
  if (!camp) return null

  const {
    id,
    address,
    campground_name,
    title_img_path,
    altitude,
    city,
    min_price,
    avg_rating,
    area,
    total_comment,
    geolocation,
  } = camp

  const [isActive, setIsActive] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCardFooterClick = () => {
    if (window.innerWidth <= 768) {
      setIsActive(!isActive)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // 解析地理位置
  const position = geolocation
    ? {
        lat: parseFloat(geolocation.split(',')[0]),
        lng: parseFloat(geolocation.split(',')[1]),
      }
    : { lat: 23.8, lng: 121.4 }

  let calc_avg_rating = (Math.round(Number(avg_rating) * 10) / 10).toFixed(1)

  return (
    <>
      <div className={styles.card}>
        <div className={styles.icons}>
          <Image onClick={handleOpen} src={MapIcon} alt="Map Icon" />
          <FavoriteBtn className={styles.icons} campgroundId={id} />
        </div>
        <Link className={styles.tdn} href={`/campground/detail?id=${id}`}>
          <div className={styles.cardBody}>
            {title_img_path && (
              <Image
                className={styles.cardImg}
                layout="fill"
                objectFit="cover"
                src={title_img_path}
                alt={campground_name}
              />
            )}
          </div>
        </Link>
        <div
          className={`${styles.cardFooter} ${isActive ? styles.active : ''}`}
          onClick={handleCardFooterClick}
        >
          <div className={styles.showArea}>
            <div className={styles.cardTitle}>
              <p>{campground_name}</p>
              <div className={styles.category}>
                <div className={`${styles.tag} ${styles.tagBg1}`}>{area}</div>
                <div className={`${styles.tag} ${styles.tagBg2}`}>
                  海拔 {altitude} 公尺
                </div>
              </div>
            </div>
            <div className={styles.arrowAndRating}>
              <div className={styles.arrow}>
                <MdKeyboardControlKey />
              </div>
              <div className={styles.ratingWrapper}>
                <span className={styles.rating}>{calc_avg_rating}</span>
                <Rating
                  name="read-only"
                  value={parseFloat(calc_avg_rating)}
                  readOnly
                  precision={0.1}
                  sx={{
                    color: '#e49366',
                  }}
                />
                <span className={styles.commentCount}>
                  {total_comment} 則評論
                </span>
              </div>
            </div>
          </div>
          <div className={styles.hr} />
          <div className={styles.middleWrapper}>
            <div className={styles.middleInfo}>
              <span className={styles.distance}>
                {city}．距{city}火車站 2.9 公里
              </span>
              <div className={styles.addressWrapper}>
                <div className={styles.locationLabel}>
                  <IoLocationOutline
                    style={{ width: '20px', height: '20px' }}
                  />
                </div>
                <span>{address}</span>
              </div>
            </div>
            <div className={styles.arrow2}>
              <MdOutlineArrowOutward />
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
            <button className="times" onClick={handleClose}>
              <LiaTimesSolid />
            </button>
            <div className="map-wrapper">
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
                    campground={camp}
                    rooms={rooms}
                    totalComment={total_comment}
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
