import { useProduct } from '@/services/product'
import ProductCard from './product-card'

export default function SwrPage({
  searchCriteria = {},
  pageNow = 1,
  perPage = 10,
  loading = true,
}) {
  const { products, error, isLoading } = useProduct(
    searchCriteria,
    pageNow,
    perPage
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {products.map((item) => {
        return <ProductCard item={item} key={item.id} />
      })}
    </div>
  )
}
