import { useState, useRef, useEffect } from 'react'
import styles from './inputBar.module.scss'
import Link from 'next/link'

//icon
import { IoLocationOutline } from 'react-icons/io5'
import { LuCalendarSearch } from 'react-icons/lu'
import { MdOutlinePeopleAlt } from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { LuPlus, LuMinus } from 'react-icons/lu'

import Calendar from '../calender/calender'
import CalculatePeople from './calculate-people'
import { useSearch } from '@/hooks/use-search'

export default function InputBar({setNameLike, handleSearch}) {
  // 抓 Context 的狀態
  const {
    searchValue = {},
    handleFieldChange = () => {},
    calenderValue = '',
    timeDifference,
    people,
    setPeople,
    addPeople,
    minusPeople,
  } = useSearch()

  const [activeDiv, setActiveDiv] = useState('')

  // For Calender
  const [isopenCalender, setIsOpenCalender] = useState(false)
  const toggleCalender = () => setIsOpenCalender(!isopenCalender)
  const openCalender = () => setIsOpenCalender(true)
  const closeCalender = () => setIsOpenCalender(false)

  const calenderRef = useRef(null)
  const triggerRef = useRef(null)

  // For People
  const [isopenPeople, setIsopenPeople] = useState(false)
  const togglePeople = () => setIsopenPeople(!isopenPeople)
  const openPeople = () => setIsopenPeople(true)
  const closePeople = () => setIsopenPeople(false)

  const peopleRef = useRef(null)
  const trigger2Ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检测点击是否发生在视窗外
      if (
        peopleRef.current &&
        !peopleRef.current.contains(event.target) &&
        trigger2Ref.current &&
        !trigger2Ref.current.contains(event.target)
      ) {
        closePeople()
      }
    }

    if (isopenPeople) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // 清理事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isopenPeople])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检测点击是否发生在视窗外
      if (
        calenderRef.current &&
        !calenderRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        closeCalender()
      }
    }

    if (isopenCalender) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // 清理事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isopenCalender])

  return (
    <>
      <div className={styles.calenderWrapper}>
        <div
          ref={calenderRef}
          className={
            isopenCalender
              ? `${styles.calender} ${styles.open}`
              : `${styles.calender}`
          }
        >
          <Calendar />
        </div>
      </div>
      <div
        ref={peopleRef}
        className={
          isopenPeople
            ? `${styles.calculateWrapper} ${styles.open}`
            : `${styles.calculateWrapper}`
        }
      >
        <div className="wrapper">
          <span className="title">選擇人數</span>
          <div className="line-wrapper">
            <span className="people-title">人數</span>
            <div className="calculate-wrapper">
              <button
                onClick={minusPeople}
                className="value-control"
                title="Decrease value"
                aria-label="Decrease value"
              >
                <LuMinus />
              </button>

              <input
                className="value-input"
                type="number"
                value={people}
                name="numberInput"
                id="numberInput"
                onChange={(e) => {
                  setPeople(Number(e.target.value))
                }}
              />

              <button
                onClick={addPeople}
                className="value-control"
                title="Increase value"
                aria-label="Increase value"
              >
                <LuPlus />
              </button>
            </div>
          </div>
          <div className="btn-wrapper">
            <button className="compBtn" onClick={closePeople}>
              完成
            </button>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <div className={styles.wrapper}>
            <IoLocationOutline className={styles.lableIcon} />
            <input
              className={styles.entryArea}
              type="text"
              name="keyword"
              value={searchValue.keyword}
              onChange={handleFieldChange}
              placeholder="你要去哪裡?"
            />
          </div>
          <div
            className={`${styles.wrapper} ${styles.center}`}
            ref={triggerRef}
            onClick={() => {
              toggleCalender()
              closePeople()
            }}
          >
            <LuCalendarSearch className={styles.lableIcon} />
            <button className={styles.entryArea}>{calenderValue}</button>
          </div>
          <div
            className={styles.wrapper}
            ref={trigger2Ref}
            onClick={togglePeople}
          >
            <MdOutlinePeopleAlt className={styles.lableIcon} />
            <button className={styles.entryArea}>{people + ' 人'}</button>
          </div>
          <Link href="/campground/campground-list" passHref>
            <div className={styles.searchBtn} onClick={() => handleSearch()}>
              <IoSearchSharp className={styles.lableIcon} />
            </div>
          </Link>
        </div>
      </div>
      <style jsx>
        {`
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .wrapper {
            background: var(--sub-color);
            width: 300px;
            height: 180px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            justify-content: space-between;
          }
          .line-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--main-color-dark);
          }
          .calculate-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .title {
            font-family: 'Noto Sans TC';
            font-size: 16x;
            font-style: normal;
            font-weight: 700;
            padding-bottom: 10px;
          }
          .people-title {
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .value-control {
            width: 30px;
            height: 30px;
            margin: 0 8px;
            background: transparent;
            border: 1px solid var(--hint-color);
            border-radius: 5px;
            color: var(--hint-color);
            cursor: pointer;
          }

          .value-control:hover {
            background: #eee;
          }

          .value-control:active {
            background: #ddd;
          }

          .value-input {
            background: transparent;
            margin: 0;
            height: 30px;
            width: 30px;
            border: 1px solid #777;
            border-radius: 5px;
            padding: 2px 8px;
            text-align: center;
            font-family: 'Montserrat';
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          .value-input:focus {
            outline: none;
          }

          .value-input:hover {
            border-color: #574426;
          }
          .btn-wrapper {
            display: flex;
            justify-content: center;
          }
          .compBtn {
            background: var(--main-color-dark);
            padding: 5px;
            width: 150px;
            border-radius: 5px;
            color: var(--main-color-bright);
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            border: none;
          }
        `}
      </style>
    </>
  )
}
