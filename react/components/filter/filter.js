import { useState } from 'react'

import { deepPurple } from '@mui/material/colors'
import FormControl from '@mui/material/FormControl'
import { menuClasses } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select, { selectClasses } from '@mui/material/Select'
import { SlArrowDown } from 'react-icons/sl'
import { RiFilterLine } from 'react-icons/ri'
import ListSubheader from '@mui/material/ListSubheader'
import InputLabel from '@mui/material/InputLabel'
import Skeleton from '@mui/material/Skeleton'

export default function Filter({
  sort,
  setSort,
  order,
  setOrder,
  total,
  setCurrentPage,
  isSearching,
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="wrapper">
        <div style={{ display: 'flex', alignItems: 'end', gap: '5px' }}>
          <div className="title-of-discount">搜尋結果 </div>
          {isSearching ? (
            <Skeleton variant="rounded" width={70} height={21} />
          ) : (
            <span className="count-camp">共 {total} 個營地</span>
          )}
        </div>
        <div className="selectBtn" onClick={() => setIsOpen(!isOpen)}>
          <div className="filterIcon">
            <RiFilterLine
              style={{
                color: 'var(--main-color-dark)',
                width: '20px',
                height: '20px',
              }}
            />
          </div>
          <FormControl>
            <Select
              id="grouped-select"
              style={{ position: 'relative' }}
              label="Grouping"
              disableUnderline
              variant="standard"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                sx: {
                  marginBlock: '0.5rem',
                  [`& .${menuClasses.paper}`]: {
                    borderRadius: '12px',
                  },
                  [`& .${menuClasses.list}`]: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    background: 'white',
                    '& li': {
                      paddingTop: '12px',
                      paddingBottom: '12px',
                    },
                    '& li:hover': {
                      background: 'var(--main-color-bright)',
                    },
                    '& li.Mui-selected': {
                      color: 'white',
                      background: 'var(--main-color-dark)',
                    },
                    '& li.Mui-selected:hover': {
                      background: 'var(--main-color-dark)',
                    },
                  },
                },
              }}
              IconComponent=""
              value={`${sort},${order}`}
              onChange={(e) => {
                const tv = e.target.value
                setSort(tv.split(',')[0])
                setOrder(tv.split(',')[1])
                setCurrentPage(1)
              }}
              sx={{
                minWidth: 200,
                background: 'transparent',
                [`& .${selectClasses.select}`]: {
                  background: 'transparent',
                  color: '#8f8e93',
                  fontFamily: 'Montserrat',
                  fontWeight: '700',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  borderBottom: '2px solid var(--main-color-dark)',
                  '&:focus': {
                    background: 'transparent',
                    borderColor: 'var(--main-color-dark)',
                  },
                },
                [`& .${selectClasses.icon}`]: {
                  right: '12px',
                  background: 'transparent',
                },
              }}
            >
              <MenuItem value={'id,asc'} selected>
                請選擇排序
              </MenuItem>
              <MenuItem value={'price,asc'}>價格(由低到高)</MenuItem>
              <MenuItem value={'price,desc'}>價格(由高到低)</MenuItem>
              <MenuItem value={'rating,asc'}>評分(由低到高)</MenuItem>
              <MenuItem value={'rating,desc'}>評分(由高到低)</MenuItem>
            </Select>
          </FormControl>
          <div className="dropdown">
            <SlArrowDown />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin-block: 32px;
          }
          .title-of-discount {
            font-family: 'Noto Sans TC';
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            margin-bottom: 0px;
          }
          .count-camp {
            font-family: 'Noto Sans TC';
            font-weight: 700;
            color: #8f8e93;
            font-size: 14px;
          }
          .filterIcon {
            position: absolute;
            top: 0;
          }
          .selectBtn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
          }
          .dropdown {
            position: absolute;
            right: 0;
            transform: rotate(0 deg);
          }
        `}
      </style>
    </>
  )
}
