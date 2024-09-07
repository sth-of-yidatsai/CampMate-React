import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useLoadItems } from '@/services/product'

export default function ListInfiniteScrollA() {
  const { loading, items, hasNextPage, error, loadMore } = useLoadItems()

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
    <ul>
      {items.map((item) => (
        <li key={item.key}>{item.value}</li>
      ))}
      {/* 
      當有"next page"下一頁時，我們在清單下方先呈現顯示"Loading"。
      當它在螢幕上變得可被見到或者靠近時，觸發'onLoadMore'。
      這稱為我們的"sentry"哨兵。
      我們也可以使用另一個"sentry"哨兵，它與"Loading"組件分開，像這樣:
        <div ref={sentryRef} />
        {loading && <ListItem>Loading...</ListItem>}
      然後獨立另一個"Loading"沒有這個ref。
      */}
      {(loading || hasNextPage) && (
        <li ref={sentryRef}>
          <div style={{ color: 'red', fontWeight: 'bold' }}>Loading...</div>
        </li>
      )}
    </ul>
  )
}
