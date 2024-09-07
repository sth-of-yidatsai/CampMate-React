import { useState, useEffect, useRef, useCallback } from 'react'
import _ from 'lodash'
import 'rc-slider/assets/index.css'
import ReactSlider from 'react-slider'
import CampgroundCardM from '../card/campground-card-m'
import { FaLocationDot } from 'react-icons/fa6'
import { LiaTimesSolid } from 'react-icons/lia'
import FilterMap from '../filter/filter_map'
import { useSearch } from '@/hooks/use-search'
import '@csstools/normalize.css'

// Google MAP
import HotelMap from '@/components/google-map/hotel-map'
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps'
import MarkerWithInfowindow from '../google-map/marker'

// MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

export default function CampgroundSidebar({
  facility,
  setFacility,
  provide,
  setProvide,
  priceGte,
  setPriceGte,
  priceLte,
  setPriceLte,
  rating,
  setRating,
  setCurrentPage,
  total,
  campgroundInfo,
  sort,
  setSort,
  order,
  setOrder,
  eachComment,
}) {
  const { position, setPosition } = useSearch()
  // MUI
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [score, setScore] = useState('')

  useEffect(() => {
    setCurrentPage(1)
  }, [score, priceGte, priceLte])

  const scoreOptions = [
    '極度好評 4.5 分以上',
    '大多好評 4.0 分以上',
    '好評  3.5 分以上',
    '褒貶不一 3.0 分以上',
    '顯示全部',
  ]

  const ratingArr = [4.5, 4.0, 3.5, 3.0, 0]

  const facilityOptions = [
    '停車場',
    '電動車充電站',
    '游泳池',
    '電梯',
    '兒童遊戲區',
  ]
  const provideOptions = [
    '衛生紙',
    '淋浴間',
    '廁所',
    '吹風機',
    '空調',
    '免費盥洗用品',
    '電熱水壺',
    '洗衣機',
    '電視',
  ]

  const handleFacilityGroup = (e) => {
    const etv = e.target.value
    // 判斷目前是否有在myPets陣列中
    if (facility.includes(etv)) {
      const nextFacility = facility.filter((v) => v !== etv)
      setFacility(nextFacility)
      setCurrentPage(1)
    } else {
      // 否則 ==> 加入陣列
      const nextFacility = [...facility, etv]
      setFacility(nextFacility)
      setCurrentPage(1)
    }
  }
  const debounceHandleFacilityGroup = useCallback(
    _.debounce(handleFacilityGroup, 1200),
    []
  )

  const handleProvideGroup = (e) => {
    setCurrentPage(1)
    const etv = e.target.value
    if (provide.includes(etv)) {
      const nextProvide = provide.filter((v) => v !== etv)
      setProvide(nextProvide)
      setCurrentPage(1)
    } else {
      // 否則 ==> 加入陣列
      const nextProvide = [...provide, etv]
      setProvide(nextProvide)
      setCurrentPage(1)
    }
  }
  const debounceHandleProvideGroup = useCallback(
    _.debounce(handleProvideGroup, 1200),
    []
  )
  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '18px',
    outline: 'none',
    display: 'flex',
  }

  //test google

  const [currentHover, setCurrentHover] = useState(0)

  useEffect(() => {
    let first_pos, latCur, lngCur
    if (campgroundInfo.length >= 1 && campgroundInfo[currentHover]) {
      first_pos = campgroundInfo[currentHover].geolocation
      latCur = Number(first_pos.split(',')[0])
      lngCur = Number(first_pos.split(',')[1])
      setPosition({ lat: latCur, lng: lngCur })
    }
  }, [
    currentHover,
    campgroundInfo,
    provide,
    priceGte,
    priceLte,
    rating,
    facility,
  ])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="times" onClick={handleClose}>
            <LiaTimesSolid />
          </button>
          <div className="wrap-wrapper">
            <div className="wrapper2">
              <h5>透過以下分類搜尋:</h5>
              <div className="divide-line"></div>
              <div className="budgetWrapper">
                <p>房價預算(每晚)</p>
                <div className="slidebar">
                  <ReactSlider
                    max={10000}
                    min={500}
                    minDistance={500}
                    step={500}
                    value={[priceGte, priceLte]}
                    onBeforeChange={(value, index) => {
                      setPriceGte(value[0])
                      setPriceLte(value[1])
                    }}
                    onChange={(value, index) => {
                      setPriceGte(value[0])
                      setPriceLte(value[1])
                    }}
                    onAfterChange={(value, index) => {
                      setPriceGte(value[0])
                      setPriceLte(value[1])
                    }}
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                  />
                </div>
                <div className="range">
                  <div>{priceGte}</div>
                  <div>{priceLte}</div>
                </div>
              </div>
              <div className="divide-line"></div>
              <div className="scoreWrapper">
                <p>評分</p>
                <div title="radio-button-group" className="radioScore">
                  {scoreOptions.map((v, i) => {
                    return (
                      <label key={i} className="container">
                        <input
                          className="scoreCheck"
                          style={{ color: 'red' }}
                          type="radio"
                          value={v}
                          checked={v === score}
                          onChange={(e) => {
                            setScore(e.target.value)
                            setRating(ratingArr[i])
                          }}
                        />
                        {v}
                        <span className="checkmark" />
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="divide-line"></div>
              <div className="pbu-wrapper">
                <p>公共設施</p>
                {facilityOptions.map((v, i) => {
                  return (
                    <label key={i} className="container">
                      <input
                        // 要設定value屬性對映v，在事件觸發時目標對象的值是這個
                        value={v}
                        type="checkbox"
                        checked={facility.includes(v)}
                        onChange={handleFacilityGroup}
                      />
                      {v}
                      <span className="checkmark" />
                    </label>
                  )
                })}
              </div>
              <div className="divide-line"></div>
              <div className="roomu-wrapper">
                <p>房間用品</p>
                {provideOptions.map((v, i) => {
                  return (
                    <label key={i} className="container">
                      <input
                        // 要設定value屬性對映v，在事件觸發時目標對象的值是這個
                        value={v}
                        type="checkbox"
                        checked={provide.includes(v)}
                        onChange={handleProvideGroup}
                      />
                      {v}
                      <span className="checkmark" />
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="hotel-card-wrapper">
            <FilterMap
              total={total}
              sort={sort}
              setSort={setSort}
              order={order}
              setOrder={setOrder}
              setCurrentPage={setCurrentPage}
            />
            {campgroundInfo.map((camp, i) => {
              return (
                <CampgroundCardM
                  setCurrentHover={setCurrentHover}
                  i={i}
                  key={i}
                  camp={camp}
                  eachComment={eachComment}
                />
              )
            })}
          </div>
          <div className="map-wrapper">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <Map
                mapTypeControl={true}
                defaultCenter={position}
                defaultZoom={10}
                mapId={'739af084373f96fe'}
                mapTypeId={'roadmap'}
                gestureHandling={'auto'}
                disableDefaultUI={true}
                // onLoad={(map) => {
                //   mapRef.current = map
                // }}
                // onDragEnd={handleMapCenterChange}
              >
                {campgroundInfo.map((camp, i) => {
                  return (
                    <MarkerWithInfowindow
                      key={i}
                      camp={camp}
                      eachComment={eachComment}
                      i={i}
                      currentHover={currentHover}
                      // infowindowOpen={infowindowOpen}
                      // setInfowindowOpen={setInfowindowOpen}
                      // handleInfoWindow={handleInfoWindow}
                    />
                  )
                })}
              </Map>
            </APIProvider>
          </div>
        </Box>
      </Modal>
      <div className="wrapper">
        <div className="mapWrapper">
          <p>於地圖上顯示</p>
          <div className="googleMap">
            <div className="dot">
              <FaLocationDot className="dot" style={{}} />
            </div>
            <button className="mapBtn" onClick={handleOpen}>
              查看地圖
            </button>
            <img
              className="map-img"
              src="/campground/map_template.webp"
              alt=""
            />
          </div>
        </div>
        <h5>透過以下分類搜尋:</h5>
        <div className="divide-line"></div>
        <div className="budgetWrapper">
          <p>房價預算(每晚)</p>
          <div className="slidebar">
            <ReactSlider
              max={10000}
              min={500}
              minDistance={500}
              step={500}
              value={[priceGte, priceLte]}
              onBeforeChange={(value, index) => {
                setPriceGte(value[0])
                setPriceLte(value[1])
              }}
              onChange={(value, index) => {
                setPriceGte(value[0])
                setPriceLte(value[1])
              }}
              onAfterChange={(value, index) => {
                setPriceGte(value[0])
                setPriceLte(value[1])
              }}
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
            />
          </div>
          <div className="range">
            <div>{priceGte}</div>
            <div>{priceLte}</div>
          </div>
        </div>
        <div className="divide-line"></div>
        <div className="scoreWrapper">
          <p>評分</p>
          <div title="radio-button-group" className="radioScore">
            {scoreOptions.map((v, i) => {
              return (
                <label key={i} className="container">
                  <input
                    className="scoreCheck"
                    style={{ color: 'red' }}
                    type="radio"
                    value={v}
                    checked={v === score}
                    onChange={(e) => {
                      setScore(e.target.value)
                      setRating(ratingArr[i])
                    }}
                  />
                  {v}
                  <span className="checkmark" />
                </label>
              )
            })}
          </div>
        </div>
        <div className="divide-line"></div>
        <div className="pbu-wrapper">
          <p>公共設施</p>
          {facilityOptions.map((v, i) => {
            return (
              <label key={i} className="container">
                <input
                  // 要設定value屬性對映v，在事件觸發時目標對象的值是這個
                  value={v}
                  type="checkbox"
                  checked={facility.includes(v)}
                  onChange={handleFacilityGroup}
                />
                {v}
                <span className="checkmark" />
              </label>
            )
          })}
        </div>
        <div className="divide-line"></div>
        <div className="roomu-wrapper">
          <p>房間用品</p>
          {provideOptions.map((v, i) => {
            return (
              <label key={i} className="container">
                <input
                  // 要設定value屬性對映v，在事件觸發時目標對象的值是這個
                  value={v}
                  type="checkbox"
                  checked={provide.includes(v)}
                  onChange={handleProvideGroup}
                />
                {v}
                <span className="checkmark" />
              </label>
            )
          })}
        </div>
      </div>
      <style jsx>
        {`
          .map-wrapper {
            width: 660px;
            height: 100%;
            border-radius: 0 30px 30px 0;
            overflow: hidden;
          }
          .wrapper {
            font-family: 'Noto Sans TC', sans-serif;
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

          .wrapper2 {
            font-family: 'Noto Sans TC', sans-serif;
            overflow: hidden;
          }
          .wrap-wrapper {
            padding: 20px;
            width: 200px;
            height: 100%;
            overflow-y: auto;
          }
          .wrap-wrapper::-webkit-scrollbar {
            width: 8px;
          }
          .wrap-wrapper::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 30px;
          }
          .hotel-card-wrapper {
            width: 342px;
            padding-inline: 20px;
            height: 100%;
            overflow-y: auto;
          }

          .hotel-card-wrapper::-webkit-scrollbar {
            width: 8px;
          }
          .hotel-card-wrapper::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 30px;
          }
          .googleMap {
            width: 187px;
            height: 314px;
            border: 1px solid var(--main-color-dark);
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            margin-bottom: 16px;
            display: grid;
            place-items: center;
          }
          .dot {
            transform: scale(1, 1);
            transition: all 0.5s ease-out;
            position: absolute;
            top: 80px;
            z-index: 2;
            font-size: 2rem;
            color: var(--main-color-dark);
          }
          .googleMap:hover .map-img {
            transform: scale(1.2, 1.2);
          }
          .googleMap:hover .mapBtn {
            transform: scale(1.1, 1.1);
          }
          .googleMap:hover .dot {
            transform: scale(1.1, 1.1);
          }
          .mapBtn {
            position: absolute;
            z-index: 2;
            background: var(--main-color-dark);
            color: var(--main-color-bright);
            padding-inline: 15px;
            padding-block: 10px;
            border-radius: 10px;
            border: none;
            transform: scale(1, 1);
            transition: all 0.5s ease-out;
          }
          .map-img {
            filter: blur(1px) brightness(90%);
            position: absolute;
            z-index: 1;
            left: -150px;
            top: -100px;
            object-fit: cover;
            width: 500x;
            height: 514px;
            transform: scale(1, 1);
            transition: all 0.5s ease-out;
          }
          .divide-line {
            background: var(--main-color-dark);
            height: 1px;
            margin-block: 17px;
          }
          .budgetWrapper {
            display: flex;
            flex-direction: column;
            padding-block: 12px;
          }
          .slidebar {
            display: grid;
            place-items: center;
          }
          .range {
            display: flex;
            justify-content: space-between;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
          }
          .radioScore {
            display: flex;
            flex-direction: column;
          }

          .container {
            display: block;
            position: relative;
            padding-left: 35px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 14px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Hide the browser's default radio button */
          .container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
          }

          /* Create a custom radio button */
          .checkmark {
            position: absolute;
            top: 5px;
            left: 0;
            height: 16px;
            width: 16px;
            background-color: white;
            border: 2px solid grey;
            border-radius: 50%;
          }

          /* On mouse-over, add a grey background color */
          .container:hover input ~ .checkmark {
            background-color: #ffcbae;
          }

          /* When the radio button is checked, add a blue background */
          .container input:checked ~ .checkmark {
            background-color: white;
            border: 2px solid var(--hint-color);
          }

          /* Create the indicator (the dot/circle - hidden when not checked) */
          .checkmark:after {
            content: '';
            position: absolute;
            display: none;
          }

          /* Show the indicator (dot/circle) when checked */
          .container input:checked ~ .checkmark:after {
            display: block;
          }

          /* Style the indicator (dot/circle) */
          .container .checkmark:after {
            top: 2px;
            left: 2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--hint-color);
          }
          .pbu-wrapper {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
}
