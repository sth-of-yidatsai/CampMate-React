import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import Card from 'react-bootstrap/Card'
import collectStyles from '@/styles/collect.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  removeCol,
  removePro,
  useCollectCampgroundByUserId,
  useCollectProductByUserId,
} from '@/services/collect'
import { TbHeartMinus } from 'react-icons/tb'
import CollectTab from './collect_Tab'

import { useAuthTest } from '@/hooks/use-auth-test'

const FILTER_OPTIONS = ['全部', '北部', '中部', '南部', '東部']
const PRODUCT_OPTIONS = [
  '全部',
  '帳篷',
  '家具',
  '照明&生火',
  '電器',
  '炊具',
  '寢具',
  '配件',
]

export default function Collect() {
  const [key, setKey] = useState('collect_campground')
  const [collectItems, setCollectItems] = useState([])
  const [cancelModal, setCancelModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState('')
  const [visibleCount, setVisibleCount] = useState(12)
  const [regionFilter, setRegionFilter] = useState('全部')
  const [productFilter, setProductFilter] = useState('全部')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCardDetails, setSelectedCardDetails] = useState(null)

  // 抓 Auth 裡面的 user 資料 ==> 這邊可以抓到 user 的 id
  const { auth } = useAuthTest()
  const userId = auth.userData.id
  console.log(userId)
  const router = useRouter()

  const {
    data: campData,
    isLoading: campLoading,
    isError: campError,
    refetch: refetchCampData,
  } = useCollectCampgroundByUserId(userId)
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
    refetch: refetchProductData,
  } = useCollectProductByUserId(userId)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('collectTab')
      if (storedKey) {
        setKey(storedKey)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('collectTab', key)
    }
  }, [key])

  const handleTabChange = useCallback((newKey) => {
    setKey(newKey)
  }, [])

  useEffect(() => {
    if (campError || productError) {
      console.error('Error fetching data:', campError || productError)
      return
    }
    if (key === 'collect_campground') {
      setCollectItems(campData?.data || [])
    } else if (key === 'collect_product') {
      setCollectItems(productData?.data || [])
    }
  }, [campData, productData, campError, productError, key])

  useEffect(() => {
    if (key === 'collect_campground') {
      setRegionFilter('全部')
    } else {
      setProductFilter('全部')
    }
    setVisibleCount(12)
  }, [key])

  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === 'region') {
      setRegionFilter(value)
    } else if (filterType === 'product') {
      setProductFilter(value)
    }
    setVisibleCount(12)
  }, [])

  const filteredData = useMemo(() => {
    let dataToFilter = collectItems.slice(0, visibleCount)

    if (key === 'collect_campground' && regionFilter !== '全部') {
      dataToFilter = dataToFilter.filter(
        (item) => item.Campground_Info?.area === regionFilter
      )
    }

    if (key === 'collect_product' && productFilter !== '全部') {
      dataToFilter = dataToFilter.filter((item) => {
        const productCategory = item.Rent_Product?.Product_Category
        if (productCategory) {
          const parentCategoryName = productCategory.ParentCategory?.cate_name
          const categoryName = productCategory.cate_name
          return (
            parentCategoryName === productFilter ||
            categoryName === productFilter
          )
        }
        return false
      })
    }

    return dataToFilter
  }, [collectItems, visibleCount, key, regionFilter, productFilter])

  const handleCardImgClick = (item) => {
    setSelectedCardDetails(item)
    setShowDetailModal(true)
  }

  const handleCardClick = (id) => {
    setSelectedCardId(id)
    setCancelModal(true)
  }

  const getTagName = (item) => {
    if (item?.Rent_Product?.Product_Relate_Tags) {
      const tags = item.Rent_Product.Product_Relate_Tags || []
      if (tags.length > 0) {
        const firstTag = tags[0]
        return firstTag.Product_Tag?.tag_name || '無標籤'
      }
    }
    return '無標籤'
  }

  const handleNavigateToDetailPage = () => {
    if (key === 'collect_campground') {
      const campgroundId = selectedCardDetails?.campground_id
      if (campgroundId) {
        router.push(`/campground/detail?id=${campgroundId}`)
      } else {
        toast.error('無法找到營地 ID')
      }
    } else if (key === 'collect_product') {
      const productId = selectedCardDetails?.product_id
      if (productId) {
        router.push(`/rent/product_detail?id=${productId}`)
      } else {
        toast.error('無法找到產品 ID')
      }
    }
  }

  if (campLoading || productLoading) return <p>載入中...</p>
  if (campError || productError) return <p>載入失敗</p>

  return (
    <div>
      <div className={collectStyles.container}>
        <h2 className={collectStyles.pageTitle}>
          <span className={collectStyles.h2}>我的收藏</span>
        </h2>
        <CollectTab onTabChange={handleTabChange} currentTab={key} />
        <div className={collectStyles.filterContainer}>
          {(key === 'collect_campground'
            ? FILTER_OPTIONS
            : PRODUCT_OPTIONS
          ).map((option) => (
            <div key={option}>
              <input
                type="radio"
                id={`${key}-${option}`}
                name={`${key}Filter`}
                value={option}
                checked={
                  (key === 'collect_campground'
                    ? regionFilter
                    : productFilter) === option
                }
                onChange={(e) =>
                  handleFilterChange(
                    key === 'collect_campground' ? 'region' : 'product',
                    e.target.value
                  )
                }
                className={collectStyles.filterRadio}
              />
              <label
                htmlFor={`${key}-${option}`}
                className={collectStyles.filterLabel}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className={collectStyles.campContent}>
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                className={collectStyles.CardStyle}
                initial={{ opacity: 0, y: 0.9 }}
                animate={{ opacity: 1, y: 1 }}
                exit={{ opacity: 0, y: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={
                      key === 'collect_campground'
                        ? item.Campground_Img?.path
                        : `/tian/image/${item.Product_Image?.image_path}`
                    }
                    className={collectStyles.CardImg}
                    onClick={() => handleCardImgClick(item)}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/pic/product.webp'
                    }}
                  />
                  <Card.Body className={collectStyles.CardBodyStyle}>
                    <div className={collectStyles.CardHStyle}>
                      <div className={collectStyles.cardTitle}>
                        <div className={collectStyles.CardTitleH}>
                          {key === 'collect_campground'
                            ? item.Campground_Info?.campground_name || '無名稱'
                            : item.Rent_Product?.product_name || '無名稱'}
                        </div>
                        <div className={collectStyles.CardTitleStyle}>
                          <div className={collectStyles.CardTitle1Style}>
                            {key === 'collect_campground'
                              ? item.Campground_Info?.area || '無地區'
                              : item.Rent_Product?.Product_Category
                                  ?.ParentCategory?.cate_name
                              ? item.Rent_Product?.Product_Category
                                  ?.ParentCategory?.cate_name
                              : item.Rent_Product?.Product_Category
                                  ?.cate_name || '無分類'}
                          </div>
                          <div className={collectStyles.CardTitle2Style}>
                            {key === 'collect_campground' ? (
                              <div className={collectStyles.CardTitle2Style}>
                                海拔 {item.Campground_Info?.altitude || '未知'}{' '}
                                m
                              </div>
                            ) : (
                              <div className={collectStyles.CardTitle2Style}>
                                {getTagName(item)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className={collectStyles.CardBtn}
                      onClick={() => handleCardClick(item.id)}
                    >
                      <TbHeartMinus className={collectStyles.CardIcon} />
                    </button>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className={collectStyles.loadMore}>
          {collectItems.length > visibleCount && (
            <button
              className={collectStyles.loadMoreBtn}
              onClick={() => setVisibleCount((prev) => prev + 12)}
            >
              載入更多
            </button>
          )}
        </div>
      </div>

      {/* RWD */}
      <div className={collectStyles.containerRWD}>
        <h2 className={collectStyles.pageTitle}>
          <span className={collectStyles.h2}>我的收藏</span>
        </h2>
        <div className={collectStyles.tabRWD}>
          <div>
            <CollectTab onTabChange={handleTabChange} currentTab={key} />
          </div>
        </div>

        <div className={collectStyles.filterRWDContainer}>
          <select
            name={`${key}Filter`}
            value={key === 'collect_campground' ? regionFilter : productFilter}
            onChange={(e) =>
              handleFilterChange(
                key === 'collect_campground' ? 'region' : 'product',
                e.target.value
              )
            }
            className={collectStyles.filterRWDSelect}
          >
            {(key === 'collect_campground'
              ? FILTER_OPTIONS
              : PRODUCT_OPTIONS
            ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={collectStyles.campContent}>
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                className={collectStyles.RWDCardStyle}
                initial={{ opacity: 0, y: 0.9 }}
                animate={{ opacity: 1, y: 1 }}
                exit={{ opacity: 0, y: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className={collectStyles.CardRWDList}>
                  <div className={collectStyles.CardDiv}>
                    <div className={collectStyles.CardRWDImgDiv}>
                      <img
                        alt=""
                        className={collectStyles.CardRWDImg}
                        variant="top"
                        src={
                          key === 'collect_campground'
                            ? item.Campground_Img?.path
                            : `/tian/image/${item.Product_Image?.image_path}`
                        }
                      />
                    </div>
                    <div className={collectStyles.CardRWDTitle}>
                      <div className={collectStyles.CardRWDTitleH}>
                        {key === 'collect_campground'
                          ? item.Campground_Info?.campground_name || '無名稱'
                          : item.Rent_Product?.product_name || '無名稱'}
                      </div>
                      <div className={collectStyles.CardRWDPDiv}>
                        <div className={collectStyles.CardRWDP}>
                          {key === 'collect_campground'
                            ? item.Campground_Info?.area || '無地區'
                            : item.Rent_Product?.Product_Category
                                ?.ParentCategory?.cate_name
                            ? item.Rent_Product?.Product_Category
                                ?.ParentCategory?.cate_name
                            : item.Rent_Product?.Product_Category?.cate_name ||
                              '無分類'}{' '}
                          ||
                          {key === 'collect_campground' ? (
                            <div>
                              海拔 {item.Campground_Info?.altitude || '未知'} m
                            </div>
                          ) : (
                            <div>{getTagName(item)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={collectStyles.CardRWDBtn}>
                      <button
                        className={collectStyles.CardRWDBtn1}
                        onClick={handleNavigateToDetailPage}
                      >
                        立即查看
                      </button>
                      <button
                        className={collectStyles.CardRWDBtn2}
                        onClick={() => handleCardClick(item.id)}
                      >
                        取消收藏
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className={collectStyles.loadMore}>
          {collectItems.length > visibleCount && (
            <button
              className={collectStyles.loadMoreBtn}
              onClick={() => setVisibleCount((prev) => prev + 12)}
            >
              載入更多
            </button>
          )}
        </div>
      </div>
      {/* 取消收藏 */}
      {cancelModal && (
        <div className={collectStyles.modalBackdrop}>
          <div className={collectStyles.modalContent}>
            <h2 className={collectStyles.cancelH}>確定取消這個收藏？</h2>
            <div className={collectStyles.submitDiv}>
              <button
                className={collectStyles.backButton}
                onClick={() => setCancelModal(false)}
              >
                取消
              </button>
              <button
                className={collectStyles.cancelButton}
                onClick={() => {
                  const removePromise =
                    key === 'collect_campground'
                      ? removeCol(selectedCardId)
                      : removePro(selectedCardId)

                  removePromise
                    .then(() => {
                      toast.success('取消成功')
                      setCancelModal(false)
                      setCollectItems((prev) =>
                        prev.filter((item) => item.id !== selectedCardId)
                      )
                      window.location.reload() //頁面重整
                    })
                    .catch(() => toast.error('取消失敗'))
                }}
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 商品詳細 */}
      {showDetailModal && selectedCardDetails && (
        <div className={collectStyles.modalBackdrop}>
          <div className={collectStyles.detailModal}>
            <h2>
              {key === 'collect_campground'
                ? selectedCardDetails.Campground_Info?.campground_name || '名稱'
                : selectedCardDetails.Rent_Product?.product_name || '名稱'}
            </h2>
            <div className={collectStyles.detailContent}>
              <img
                src={
                  key === 'collect_campground'
                    ? selectedCardDetails.Campground_Img?.path
                    : `/tian/image/${selectedCardDetails?.Product_Image?.image_path}`
                }
                alt={
                  key === 'collect_campground'
                    ? selectedCardDetails.Campground_Info?.campground_name ||
                      '圖片'
                    : selectedCardDetails.Rent_Product?.product_name || '圖片'
                }
                className={collectStyles.detailImg}
              />
              <div className={collectStyles.detailContent1}>
                <div className={collectStyles.detailContentH}>簡介</div>
                <div className={collectStyles.detailContentP}>
                  {key === 'collect_campground'
                    ? selectedCardDetails.Campground_Info
                        ?.campground_introduction || '這裡是詳細信息'
                    : selectedCardDetails.Rent_Product?.product_description ||
                      '這裡是詳細信息'}
                </div>
                <div className={collectStyles.detailContentBtnDiv}>
                  <button
                    className={collectStyles.detailContentBtn}
                    onClick={handleNavigateToDetailPage}
                  >
                    前往商品頁面
                  </button>
                </div>
              </div>
            </div>
            <button
              className={collectStyles.closeButton}
              onClick={() => setShowDetailModal(false)}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
