import React from 'react'
import Link from 'next/link'

export default function Index() {
  return (
    <>
      <h1>商品測試頁(無限捲動)</h1>
      <p>
        <Link href="/test/product/infinite-scroll/is-a">測試用(全頁)</Link>
      </p>
      <p>
        <Link href="/test/product/infinite-scroll/is-b">測試用(區塊)</Link>
      </p>
      <p>
        <Link href="/test/product/infinite-scroll/is-c">
          測試用(商品資料全頁)
        </Link>
      </p>
      <p>
        <Link href="/test/product/infinite-scroll/is-p">
          測試用(商品資料全頁)+卡片
        </Link>
      </p>
    </>
  )
}
