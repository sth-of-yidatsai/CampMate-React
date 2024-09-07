import { useState } from 'react'
// import useInfiniteScroll from 'react-infinite-scroll-hook'
// import { useLoadProductItems } from '@/services/product'
// import ProductCard from '@/components/product-test/product-card'
import ProductInfiniteScrollList from '@/components/product-test/product-is-list'

export default function ListInfiniteScrollP() {
  // 1. 此設定會影響到每頁呈現的商品數量與伺服器回傳的次數，請勿設太小，最好是滿2-3頁的數量一次載入
  // 2. 需要給最大限制數量，否則會造成伺服器負擔太大。應以使用者會看的數量為限制(約200~500)。
  // 最少要設定 3 筆，不能設太大，因為搜尋後少於3筆會無資料
  const [perPage, setPerPage] = useState(3) // 每頁幾筆

  // 搜尋條件
  // page=1&name_like=e&brand_ids=1,2&cat_ids=4,5,6,7,8&size_ids=1,2&tag_ids=3,4&color_ids=1,2&sort=id&order=asc&perpage=10&price_gte=1500&price_lte=10000
  const [searchCriteria, setSearchCriteria] = useState({
    name_like: '',
    brand_ids: '1,2',
    cat_ids: '4,5,6,7,8',
    color_ids: '1,2',
    size_ids: '1,2',
    tag_ids: '3,4',
    sort: 'id',
    order: 'asc',
    rice_gte: 1500,
    price_lte: 10000,
  })

  // 由於元件的 key 值不同，所以每次都會重新 render
  // https://stackoverflow.com/questions/54895883/reset-to-initial-state-with-react-hooks
  const [ramdomKey, setRamdomKey] = useState(0)

  return (
    <>
      <input
        type="text"
        value={searchCriteria.name_like}
        onChange={(e) => {
          setSearchCriteria({
            ...searchCriteria,
            name_like: e.target.value,
          })
        }}
      />
      <button
        onClick={() => {
          setRamdomKey(ramdomKey + 1)
        }}
      >
        搜尋
      </button>
      {/* 呈現目前商品頁 */}
      <ProductInfiniteScrollList
        key={ramdomKey}
        perPage={perPage}
        searchCriteria={searchCriteria}
      />
    </>
  )
}
