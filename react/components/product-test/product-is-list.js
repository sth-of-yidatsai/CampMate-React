// import { useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useLoadProductItems } from '@/services/product'
import ProductCard from '@/components/product-test/product-card'

export default function ProductInfiniteScrollList({
  perPage = 3,
  searchCriteria = {},
}) {
  // 1. 此設定會影響到每頁呈現的商品數量與伺服器回傳的次數，請勿設太小，最好是滿2-3頁的數量一次載入
  // 2. 需要給最大限制數量，否則會造成伺服器負擔太大。應以使用者會看的數量為限制(約200~500)。
  // const [perPage, setPerPage] = useState(12) // 每頁幾筆

  // 搜尋條件
  // page=1&name_like=e&brand_ids=1,2&cat_ids=4,5,6,7,8&size_ids=1,2&tag_ids=3,4&color_ids=1,2&sort=id&order=asc&perpage=10&price_gte=1500&price_lte=10000
  // const searchCriteria = {
  //   brand_ids: '1,2',
  //   cat_ids: '4,5,6,7,8',
  //   color_ids: '1,2',
  //   size_ids: '1,2',
  //   tag_ids: '3,4',
  //   sort: 'id',
  //   order: 'asc',
  //   rice_gte: 1500,
  //   price_lte: 10000,
  // }

  const { loading, items, hasNextPage, error, loadMore } = useLoadProductItems(
    searchCriteria, // 搜尋條件
    perPage, // 每頁幾筆
    400 // 限制最大載入資料筆數 maxItems
  )

  console.log('items', items)

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    // 當有錯誤發生時，停止無限載入。
    // 可以設定 "error" state 為 undefined 來重新啟動。
    disabled: !!error,
    // `rootMargin` 會傳遞給 `IntersectionObserver`.
    // 當sentry(哨兵)靠近到附近的邊界時，用來觸發 'onLoadMore' 被看見
    // 上 右 下 左
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <>
      {/* 呈現目前商品頁 */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {items.map((item) => {
          return <ProductCard item={item} key={item.id} />
        })}
        {/* 下面是載入資料用的，哨兵邊界設得高些時，通常看不見 */}
        {(loading || hasNextPage) && (
          <div ref={sentryRef}>
            <div style={{ color: 'red', fontWeight: 'bold' }}>Loading...</div>
          </div>
        )}
      </div>
    </>
  )
}
