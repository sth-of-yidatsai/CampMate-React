import { useState, useEffect } from 'react'
import { getProducts } from '@/services/product'
import BS5Pagination from '@/components/common/bs5-pagination'
import { delay } from '@/hooks/use-loader'
import ProductCardLoading from '@/components/product-test/product-card-loading'

export default function ListLoading() {
  const [pageNow, setPageNow] = useState(1) // 目前頁數
  const [perPage, setPerPage] = useState(9) // 每頁幾筆

  // 從伺服器取得的總筆數, 總頁數, 商品資料
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [products, setProducts] = useState([])

  // 手動控制載入動畫
  const [loading, setLoading] = useState(true)

  // 搜尋條件
  // page=1&name_like=e&brand_ids=1,2&cat_ids=4,5,6,7,8&size_ids=1,2&tag_ids=3,4&color_ids=1,2&sort=id&order=asc&perpage=10&price_gte=1500&price_lte=10000
  const searchCriteria = {
    brand_ids: '1,2',
    cat_ids: '4,5,6,7,8',
    color_ids: '1,2',
    size_ids: '1,2',
    tag_ids: '3,4',
    sort: 'id',
    order: 'asc',
    rice_gte: 1500,
    price_lte: 10000,
  }

  // 取得商品資料
  const handleGetProducts = async () => {
    const res = await getProducts(searchCriteria, pageNow, perPage)

    // console.log(res.data)
    if (res.data.status === 'success') {
      setTotal(res.data.data.total)
      setPageCount(res.data.data.pageCount)
      setProducts(res.data.data.products)
    }
  }

  // 分頁元件的頁碼改變時
  const handlePageClick = (event) => {
    setPageNow(event.selected + 1)
  }

  // 頁面載入時+目前頁數改變時，取得商品資料
  useEffect(() => {
    // 捲動到最上層
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }

    // 開啟載入動畫
    if (!loading) setLoading(true)

    handleGetProducts() // 取得商品資料
      .then(delay(1500)) // 延遲1.5秒
      .then(() => setLoading(false)) // 關閉載入動畫

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNow]) // 頁面載入時+目前頁數改變時

  return (
    <>
      {/* 呈現頁目資訊 */}
      <div className="my-3">
        <button
          onClick={() => {
            // min is 1 (不能小於1)
            const newPageNow = pageNow - 1 > 1 ? pageNow - 1 : 1
            setPageNow(newPageNow)
          }}
        >
          上一頁
        </button>
        <button
          onClick={() => {
            // max is pageCount (不能大於總頁數)
            const newPageNow = pageNow + 1 < pageCount ? pageNow + 1 : pageCount
            setPageNow(newPageNow)
          }}
        >
          下一頁
        </button>
        <span className="mx-2">
          目前頁面: {pageNow} / 總頁數: {pageCount} / 總項目數: {total}
        </span>
      </div>
      {/* 呈現目前商品頁 */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products &&
          products.map((item) => {
            return (
              <ProductCardLoading item={item} key={item.id} loading={loading} />
            )
          })}
      </div>
      {/*  呈現分頁元件 */}
      <div className="my-3">
        <BS5Pagination
          forcePage={pageNow - 1}
          onPageChange={handlePageClick}
          pageCount={pageCount}
        />
      </div>
    </>
  )
}
