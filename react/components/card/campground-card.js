import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Rating from '@mui/material/Rating'
import { useSearch } from '@/hooks/use-search'
import { useAuthTest } from '@/hooks/use-auth-test'

// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { IoLocationOutline } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa6'

export default function CampgroundCard({ camp, eachComment }) {
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
    area,
  } = camp

  let calc_avg_rating = (Math.round(Number(avg_rating) * 10) / 10).toFixed(1)

  let newComment = eachComment.filter((v, i) => {
    return v.campground_id == id
  })

  const router = useRouter()
  const handleGoDetail = (e) => {
    // e.stopPropagation()
    router.push(`/campground/detail?id=${id}`)
  }

  // 新增至收藏 的愛心變化（實心空心）
  const [like, setLike] = useState(false)

  const { auth } = useAuthTest()
  const postFavorite = async () => {
    if (!auth.isAuth) {
      notifyFav()
      return
    }
    try {
      const response = await fetch(
        'http://localhost:3005/api/campground/collect',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campground_id: id }),
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      if (result.message === 'Favorite removed') {
        setLike(false)
      } else if (result.message === '授權失敗，沒有存取令牌') {
        notifyFav()
      } else if (result.message === '新增收藏成功') {
        setLike(true)
      }
      console.log(result.message)
    } catch (error) {
      console.error('Error processing favorite request:', error)
    }
  }
  const handleAddLike = (e) => {
    // 阻止冒泡事件
    e.stopPropagation()
    postFavorite()
  }

  const fetchFavoriteStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/campground/collect/${id}`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      console.log(result)
      setLike(result.like)
    } catch (error) {
      console.error('Error fetching favorite status:', error)
    }
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

  useEffect(() => {
    fetchFavoriteStatus()
  }, [])

  return (
    <>
      <div className="wrapper" onClick={handleGoDetail}>
        <div className="ground-img-wrapper">
          <img src={title_img_path} className="ground-img" />
        </div>
        <div className="card-text">
          <div className="topWrapper">
            <div className="titleWrapper">
              <div className="title-top-wrapper">
                <h3 className="title">{campground_name}</h3>
                <div className="favorite" onClick={handleAddLike}>
                  {like ? (
                    <FaHeart style={{ color: 'var(--hint-color)' }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </div>
              </div>
              <div className="categoryWrapper">
                <span className="darkTag">{area}</span>
                <span className="hintTag">海拔 {altitude} 公尺</span>
              </div>
            </div>
          </div>

          <div className="middleWrapper">
            <span className="distance">
              所在地 : {city}
            </span>
            <div className="addressWrapper">
              <div className="locationLabel">
                <IoLocationOutline style={{ width: '20px', height: '20px' }} />
              </div>
              <span>{address}</span>
            </div>
          </div>
          <div className="bottomWrapper">
            <div className="ratingWrapper">
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
              <span className="commentCount">
                {newComment[0].total_ratings} 則評論
              </span>
            </div>
            <div className="priceWrapper">
              <span className="day-customer">
                {timeDifference}晚、{people}位入住
              </span>
              <span className="price">$ {min_price}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .link {
            text-decoration: none;
          }
          .wrapper {
            background: var(--sub-color);
            width: 100%;
            padding: 20px;
            font-family: 'Noto Sans TC', sans-serif;
            color: var(--main-color-dark);
            display: flex;
            gap: 32px;
            border-radius: 18px;
            margin-block: 32px;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .wrapper:hover {
             {
              /* box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
              rgba(14, 30, 37, 0.32) 0px 2px 16px 0px; */
            }
            transform: scale(1.02);
          }
          .ground-img-wrapper {
            width: 384px;
            height: 186px;
            border-radius: 18px;
            overflow: hidden;
          }
          .ground-img {
            width: 384px;
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
          .title-top-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: start;
            cursor: pointer;
          }
          .favorite {
            font-size: 1.4rem;
            display: flex;
            align-items: start;
          }

          .favorite:hover {
            color: var(--hint-color);
          }

          .card-text {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .title {
            font-size: 20px;
            font-weight: 600;
          }
          .distance {
            font-size: 14px;
          }

          .middleWrapper {
            padding-top: 6px;
          }
          .addressWrapper {
            display: flex;
            gap: 6px;
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
            align-items: center;
            gap: 5px;
          }

          .rating {
            background: var(--hint-color);
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            padding: 5px;
            color: var(--main-color-bright);
            border-radius: 10px;
          }
          .commentCount {
            color: #8f8e93;
            font-size: 12px;
          }
          .bottomWrapper {
            display: flex;
            justify-content: space-between;
            align-items: end;
          }
          .priceWrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
