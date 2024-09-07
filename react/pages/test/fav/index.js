import ProductCard from '@/components/fav-test/product-card'
import Link from 'next/link'
import { useProduct } from '@/services/product'
import { Toaster } from 'react-hot-toast'

export default function FavIndex() {
  // 呈現30樣商品
  const { products, total, error, isLoading } = useProduct({}, 1, 30)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <>
      <Link href="/test/user">會員登入頁</Link>
      <hr />
      <ul>
        {products.map((v) => {
          return (
            <ProductCard key={v.id} id={v.id} name={v.name} price={v.price} />
          )
        })}
      </ul>
      <Toaster />
    </>
  )
}
