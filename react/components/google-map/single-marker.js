import React, { useEffect, useState } from 'react'
import { useSearch } from '@/hooks/use-search'
import {
  Pin,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'

// MUI
import Rating from '@mui/material/Rating'
// ICON
import { LiaTimesSolid } from 'react-icons/lia'

export default function SingleMarker({
  position,
  campground,
  rooms,
  totalComment,
}) {
  const [infowindowOpen, setInfowindowOpen] = useState(true)
  const [markerRef, marker] = useAdvancedMarkerRef()
  // const { geolocation, campground_name, avg_rating, min_price, id } = camp
  const { people, timeDifference } = useSearch()

  // const priceArr = rooms
  //   .filter((room) => room.room_people > people)
  //   .map((item) => item.price_per_day)
  const minPrice = campground.min_price
  let calc_avg_rating = (
    Math.round(Number(campground.avg_rating) * 10) / 10
  ).toFixed(1)

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(!infowindowOpen)}
        position={position}
        title={campground.campground_name}
      >
        <Pin
          background={'var(--hint-color)'}
          borderColor={'var(--main-color-dark)'}
          glyphColor={'var(--main-color-dark)'}
          style={{ background: 'green' }}
        ></Pin>
      </AdvancedMarker>
      {infowindowOpen && (
        <InfoWindow
          style={{ position: 'relative' }}
          anchor={marker}
          maxWidth={250}
          headerDisabled={true}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div className="title-wrapper">
            <div className="title">{campground.campground_name}</div>
            <button className="times" onClick={() => setInfowindowOpen(false)}>
              <LiaTimesSolid />
            </button>
          </div>
          <div className="ratingWrapper">
            <div style={{ display: 'flex', alignItems: 'end', gap: '3px' }}>
              <span className="rating">{calc_avg_rating}</span>
              <Rating
                name="read-only"
                value={calc_avg_rating}
                precision={0.1}
                readOnly
                sx={{
                  color: '#e49366',
                }}
              />
            </div>
            <span className="commentCount">
              {totalComment} 則評論
            </span>
          </div>
          <div className="priceWrapper">
            <span className="day-customer">
              {timeDifference}晚、{people}位入住
            </span>
            <span className="price">$ {minPrice * timeDifference }</span>
          </div>
        </InfoWindow>
      )}

      <style jsx>
        {`
          .title-wrapper {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            align-items: start;
          }
          .times {
            font-size: 16px;
          }
          .times:hover {
            color: var(--hint-color);
          }
          .title {
            font-family: 'Montserrat', sans-serif;
            font-size: 20px;
            color: var(--main-color-dark);
            font-weight: 600;
          }
          .ratingWrapper {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            gap: 5px;
          }

          .rating {
            background: var(--hint-color);
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            padding: 5px;
            color: var(--main-color-bright);
            border-radius: 10px;
          }
          .commentCount {
            color: #8f8e93;
            font-size: 10px;
          }
          .priceWrapper {
            display: flex;
            flex-direction: column;
            gap: 0px;
            align-items: end;
            color: var(--main-color-dark);
          }
          .day-customer {
            font-size: 12px;
          }
          .price {
            font-family: 'Montserrat', sans-serif;
            font-size: 25px;
            font-weight: 600;
            color: var(--main-color-dark);
          }
           {
            /* animation */
          }
          .bounce {
            background-color: var(--hint-color);
          }
        `}
      </style>
    </>
  )
}
