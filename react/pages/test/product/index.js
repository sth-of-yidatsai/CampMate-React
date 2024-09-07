import React from 'react'
import Link from 'next/link'

export default function Index() {
  return (
    <>
      <h1>商品測試頁</h1>
      <p>
        <Link href="/test/product/state">商品測試頁(state)</Link>
      </p>
      <p>
        <Link href="/test/product/query">商品測試頁(query)</Link>
      </p>
    </>
  )
}
