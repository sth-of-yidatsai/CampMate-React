import { useState, useEffect } from 'react'
import SwrPage from '@/components/product-test/swr-page'
import { useProduct } from '@/services/product'
import BS5Pagination from '@/components/common/bs5-pagination'

export default function SwrList() {
  const [pageNow, setPageNow] = useState(1)
  const [perPage, setPerPage] = useState(9)

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNow]) // 頁面載入時+目前頁數改變時

  // useProduct() 是自訂的 Hook，用來取得商品資料與其它資訊
  // 這勾子可以共享資料(內有狀態)，並且在多個元件之間保持資料同步
  const { total, pageCount, error, isLoading } = useProduct(
    searchCriteria,
    pageNow,
    perPage
  )

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setPageNow(event.selected + 1)
  }

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <>
      <div className="my-3">
        <button
          onClick={() => {
            // min is 1
            const newPageNow = pageNow - 1 > 1 ? pageNow - 1 : 1
            setPageNow(newPageNow)
          }}
        >
          上一頁
        </button>
        <button
          onClick={() => {
            // max is totalPage
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
      {/* page of SWR */}
      <SwrPage
        pageNow={pageNow}
        perPage={perPage}
        searchCriteria={searchCriteria}
      />
      {/* 由於SWR的快取機制，可以預先載入下一頁的頁面。將下一頁的頁面渲染到隱藏的div中，
      這樣SWR 就會觸發下一頁頁面的資料擷取。當使用者導航到下一頁時，資料就已經存在了 */}
      <div style={{ display: 'none' }}>
        <SwrPage
          pageNow={pageNow + 1}
          perPage={perPage}
          searchCriteria={searchCriteria}
        />
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
