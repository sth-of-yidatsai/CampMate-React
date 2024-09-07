//** 麵包屑導覽 */

import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useQuery } from '@/hooks/use-query'

export default function Bread_crumb() {
  const router = useRouter()

  const { isRentHomePage, isDetailPage, singleProduct } = useQuery()

  return (
    <>
      <div className="bread-tian d-flex justify-content-center">
        <span className="material-symbols-outlined sub-text-tian">
          home_pin
        </span>
        <ul className="m-0 p-0">
          <li>
            <Link
              href={`http://localhost:3000/home`}
              className="p2-en-tian sub-text-tian none-decor-tian"
            >
              HOME
            </Link>
          </li>
          <li>
            <span className="p2-en-tian sub-text-tian"> \ </span>
            <Link
              href={`http://localhost:3000/rent`}
              className="p2-en-tian sub-text-tian none-decor-tian"
              onClick={(e) => {
                e.preventDefault() // 阻止Link的預設行為
                window.location.href = '/rent' // 強制刷新頁面
              }}
            >
              RENT
            </Link>
          </li>
          {((!isRentHomePage && router.pathname == `/rent/product_list`) ||
            router.pathname.split('?')[0] == `/rent/product_detail`) && (
            <li>
              <span className="p2-en-tian sub-text-tian"> \ </span>
              <Link
                href={`http://localhost:3000/rent/product_list`}
                className="p2-tc-tian sub-text-tian none-decor-tian"
                onClick={(e) => {
                  e.preventDefault() // 阻止Link的預設行為
                  window.location.href = '/rent/product_list' // 強制刷新頁面
                }}
              >
                商品列表
              </Link>
            </li>
          )}
          {router.pathname.split('?')[0] == `/rent/product_detail` && (
            <li>
              <span className="p2-en-tian sub-text-tian"> \ </span>
              <span
                style={{ cursor: 'pointer' }}
                className="p2-tc-tian sub-text-tian none-decor-tian"
              >
                {singleProduct != undefined && singleProduct.product_name}
              </span>
            </li>
          )}
          {(router.pathname == `/rent_cart` ||
            router.pathname == `/rent_cart/cart_pay`) && (
            <li>
              <span className="p2-en-tian sub-text-tian"> \ </span>
              <span
                style={{ cursor: 'pointer' }}
                className="p2-tc-tian sub-text-tian none-decor-tian"
              >
                購物車
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
