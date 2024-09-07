import React, { useEffect, useState, use } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { useQuery } from '@/hooks/use-query'

// 滑動條組件導入
import ReactSlider from 'react-slider'
// mui組件導入
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { ClientPageRoot } from 'next/dist/client/components/client-page'

export default function AsideAutoToggle() {
  const {
    getProducts,
    products,
    tags,
    filters,
    setFilters,
    mainLabel,
    priceGte,
    setPriceGte,
    priceLte,
    setPriceLte,
    liveTag,
    setLiveTag,
    livePrice,
    setLivePrice,
    updateFilters,
    toggleFiltersArr,
    updateFiltersObj,
    toggleFiltersObjArr,
    addFiltersObjArr,
    cleanAllTag,
    resetFilters,
    handleParams,
    queryParams,
    setQueryParams,
    isRentHomePage,
    goToList,
  } = useQuery()

  // 定義狀態追蹤目前打開的 SubMenu
  const [openSubMenu, setOpenSubMenu] = useState(null)

  // 控制SubMenu開關
  const handleSubMenuClick = (index) => {
    if (openSubMenu === index) {
      setOpenSubMenu(null)
    } else {
      setOpenSubMenu(index)
    }
  }

  //--------------------------------------------------------------

  // 控制設定點擊的category到cate狀態中
  const handleCate = (e) => {
    const cateContent = {
      keyword: '',
      sort: {
        sort_name: '',
        sort_orderBy: '',
      },
      category: e.target.querySelector('div').textContent,
      tag: {
        brand: [],
        people: [],
        functional: [],
        material: [],
        price: [],
      },
      price: {
        priceGte: '',
        priceLte: '',
      },
    }
    setFilters(cateContent)
    goToList()
  }

  // 控制清除所有checkbox設定的條件
  const handleClean = () => {
    cleanAllTag()
    setLivePrice([])
    setLiveTag({
      brand: [],
      people: [],
      functional: [],
      material: [],
      price: [],
    })
    setPriceGte(0)
    setPriceLte(2500)
  }

  // 設定價格的區間(要搜尋)
  const setPriceRange = () => {
    let priceArr = []
    priceArr = [...priceArr, priceGte]
    priceArr = [...priceArr, priceLte]

    setLivePrice(priceArr)
  }

  // 將所有的篩選標籤 收集設定進tagValues的狀態中
  const collectTagValue = (e) => {
    // 抓取對應標籤的checkbox的name 以及 value
    const tag_parent = e.target.name
    const tag_child = e.target.value

    setLiveTag((prevLiveTag) => {
      const currentArray = prevLiveTag[tag_parent]

      if (currentArray.includes(tag_child)) {
        return {
          ...prevLiveTag,
          [tag_parent]: [
            ...prevLiveTag[tag_parent].filter((item) => item != tag_child),
          ],
        }
      } else {
        return {
          ...prevLiveTag,
          [tag_parent]: [...currentArray, tag_child],
        }
      }
    })

    // toggleFiltersObjArr('tag', tag_parent, tag_child)
  }

  // 控制開始篩選
  const handleFilter = () => {
    updateFiltersObj('price', 'priceGte', livePrice[0])
    updateFiltersObj('price', 'priceLte', livePrice[1])

    addFiltersObjArr('tag', liveTag)
  }

  useEffect(() => {
    setPriceRange()
  }, [priceGte, priceLte])

  return (
    <>
      <Sidebar className="sidebar">
        <Menu>
          <h2>商品分類</h2>
          {mainLabel.map((main, i) => {
            return (
              <SubMenu
                key={i}
                label={main.title}
                icon={main.icon}
                className="level1"
                open={openSubMenu === i}
                onClick={() => {
                  handleSubMenuClick(i)
                }}
              >
                {main.subLabel.map((sub, i) => {
                  return (
                    <MenuItem
                      key={sub.child_id}
                      className="level2"
                      onClick={handleCate}
                    >
                      {sub.child_name}
                      <div className="d-none">{sub.child_id}</div>
                    </MenuItem>
                  )
                })}
              </SubMenu>
            )
          })}
        </Menu>

        {/* <!-- ↓↓↓↓ 價格的篩選 ↓↓↓↓ --> */}
        {!isRentHomePage && (
          <>
            <div className="budgetWrapper tian">
              <p className="sub-text-tian p2-tc-tian">價格範圍</p>
              <div className="slidebar">
                <ReactSlider
                  max={2500}
                  min={0}
                  minDistance={0}
                  step={50}
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
            {/* <!-- ↑↑↑↑ 價格的篩選 ↑↑↑↑ --> */}
            {/* <!-- ↓↓↓↓ 標籤的篩選 ↓↓↓↓ --> */}
            <div className="tagSelect tian">
              <div className="tagSelectHeader">
                <p className="sub-text-tian p2-tc-tian">條件篩選</p>
                <div
                  onClick={handleClean}
                  className="clean p3-tc-tian secondary-text-tian"
                >
                  清除
                </div>
              </div>
              {tags.map((tag, i) => {
                let tag_parent_name
                switch (tag.parent_name) {
                  case 'brand':
                    tag_parent_name = '品牌'
                    break
                  case 'people':
                    tag_parent_name = '人數'
                    break
                  case 'functional':
                    tag_parent_name = '功能'
                    break
                  case 'material':
                    tag_parent_name = '材質'
                    break
                  case 'price':
                    tag_parent_name = '價格區間'
                    break
                }
                let childList = []
                return (
                  <React.Fragment key={i}>
                    <FormGroup key={tag.parent_id}>
                      <p className="p2-tc-tian primary-text-tian my-2">
                        {tag_parent_name}
                      </p>
                      {/* <RadioGroup
                    aria-labelledby={tag.parent_name}
                    name={tag.parent_name}
                  > */}
                      {products.map((product, i) => {
                        if (product[`${tag.parent_name}_id`] == tag.parent_id) {
                          // 將匹配的子項加到 childList
                          const children =
                            product[`${tag.parent_name}_child`].split(',')

                          // 將子項加到 childList
                          childList.push(...children)
                          // 清除重複的部分
                          childList = [...new Set(childList)]
                        }
                        return null
                      })}
                      {childList.length > 0 &&
                        childList.map((childname, i) => (
                          <FormControlLabel
                            key={`control${i}`}
                            control={
                              <Checkbox
                                sx={{
                                  color: '#8f8e93',
                                  '&.Mui-checked': { color: '#e49366' },
                                  '& .MuiSvgIcon-root': {
                                    borderRadius: '8px', // 可選：設置外框的圓角
                                  },
                                  '&:hover': {
                                    boxShadow: 'none',
                                  },
                                }}
                                key={`checkbox${i}`}
                                name={tag.parent_name}
                                size="small"
                                value={childname}
                                checked={liveTag[tag.parent_name]?.includes(
                                  childname
                                )}
                              />
                            }
                            label={`${childname}`} // 根據需要設置 label
                            onChange={collectTagValue}
                          />
                        ))}
                      {/* </RadioGroup> */}
                    </FormGroup>
                  </React.Fragment>
                )
              })}
            </div>
            {/* <!-- ↑↑↑↑ 標籤的篩選 ↑↑↑↑ --> */}
            <button
              className="filterBtn-tian primary-btn-tian p2-tc-tian"
              onClick={handleFilter}
            >
              開始篩選
            </button>
          </>
        )}
      </Sidebar>
    </>
  )
}
