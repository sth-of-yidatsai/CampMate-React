import { useState, useEffect } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import Rating from '@mui/material/Rating'
import { useSearch } from '@/hooks/use-search'
import Link from 'next/link'

export default function CampgroundCardM({
  camp,
  setCurrentHover,
  i,
  eachComment,
}) {
  // 抓 Context 的狀態
  const { calenderValue = '', people, timeDifference } = useSearch()
  const {
    id,
    email,
    address,
    phone,
    campground_name,
    title_img_path,
    campground_introduction,
    altitude,
    city,
    geolocation,
    campground_owner_id,
    min_price,
    avg_rating,
  } = camp

  let calc_avg_rating = (Math.round(Number(avg_rating) * 10) / 10).toFixed(1)

  let newComment = eachComment.filter((v, i) => {
    return v.campground_id == id
  })

  return (
    <>
      <Link
        onMouseEnter={() => {
          setCurrentHover(i)
          
        }}
        href={`/campground/detail?id=${id}`}
        style={{ color: 'inherit', textDecoration: 'inherit' }}
      >
        <div className="wrapper">
          <div className="ground-img-wrapper">
            <img src={title_img_path} className="ground-img" />
          </div>
          <div className="card-text">
            <div className="topWrapper">
              <div className="titleWrapper">
                <h3 className="title">{campground_name}</h3>
                <div className="ratingWrapper">
                  <div
                    style={{ display: 'flex', alignItems: 'end', gap: '3px' }}
                  >
                    <span className="rating">{calc_avg_rating}</span>
                    <span className="commentCount">{newComment[0].total_ratings} 則評論</span>
                  </div>
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
              </div>
            </div>
            <div className="bottomWrapper">
              <div className="priceWrapper">
                <span className="day-customer">
                  {timeDifference}晚、{people}位入住
                </span>
                <span className="price">$ {min_price}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <style jsx>
        {`
          .link {
            text-decoration: none;
          }
          .wrapper {
            background: var(--sub-color);
            width: 100%;
            padding: 0px;
            font-family: 'Noto Sans TC', sans-serif;
            color: var(--main-color-dark);
            display: flex;
            gap: 5px;
            border-radius: 18px;
            margin-block: 32px;
            transition: transform 0.3s ease;
          }
          .wrapper:hover {
            box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
              rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
              transform: scale(1.02);
          }

          .ground-img-wrapper {
            width: 150px;
            height: 186px;
            border-radius: 18px;
            overflow: hidden;
          }
          .ground-img {
            width: 150px;
            height: 186px;
            object-fit: cover;
            transform: scale(1, 1);
            transition: all 0.5s ease-out;
          }
          .wrapper:hover .ground-img {
            transform: scale(1.2, 1.2);
          }

          .titleWrapper {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .card-text {
            padding: 10px;
            max-width: 150px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .title {
            font-size: 14px;
            font-weight: 500;
          }
          .distance {
            font-size: 14px;
          }

          .middleWrapper {
            padding-top: 6px;
          }
          .addressWrapper {
            display: flex;
            flex-direction: column;
            gap: 2px;
            span {
              color: #8f8e93;
              font-size: 12px;
              line-height: 30px;
            }
          }

          .categoryWrapper {
            display: flex;
            gap: 6px;
          }
          .darkTag {
            background: var(--main-color-dark);
            border-radius: 16px;
            padding-inline: 5px;
            padding-block: 2px;
            color: var(--main-color-bright);
            font-size: 12px;
          }
          .hintTag {
            background: var(--hint-color);
            border-radius: 16px;
            padding-inline: 5px;
            padding-block: 2px;
            color: var(--main-color-bright);
            font-size: 12px;
          }

          .locationLabel {
            color: var(--hint-color);
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
          .bottomWrapper {
            display: flex;
            justify-content: end;
            align-items: end;
            margin-top: 10px;
          }
          .priceWrapper {
            display: flex;
            flex-direction: column;
            gap: 0px;
            align-items: end;
          }
          .day-customer {
            font-size: 12px;
          }
          .price {
            font-family: 'Montserrat', sans-serif;
            font-size: 25px;
            font-weight: 600;
          }
        `}
      </style>
    </>
  )
}
