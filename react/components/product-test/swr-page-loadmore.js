import { useProductMore } from '@/services/product'
import { useState } from 'react'

export default function PageLoadMore() {
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

  const [perPage, setPerPage] = useState(5)

  const { data, size, isLoading, mutate, error, setSize, isValidating } =
    useProductMore(searchCriteria, 5)

  if (error) return 'error'
  if (!data) return 'loading...'

  console.log(data)

  const products = data ? [].concat(...data) : []

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < perPage)
  const isRefreshing = isValidating && data && data.length === size

  return (
    <div>
      <p>
        呈現 第 {size} 頁中的 {isLoadingMore ? '...' : products.length} 商品{' '}
        <button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? 'loading...'
            : isReachingEnd
            ? 'no more issues'
            : 'load more'}
        </button>
        <button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? 'refreshing...' : 'refresh'}
        </button>
        <button disabled={!size} onClick={() => setSize(0)}>
          clear
        </button>
      </p>
      {products.map((product) => {
        return (
          <p key={product.id} style={{ margin: '6px 0' }}>
            - {product.name}
          </p>
        )
      })}
    </div>
  )
}
