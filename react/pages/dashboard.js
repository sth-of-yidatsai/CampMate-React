import React from 'react'
import AdminLayout from '@/components/layout/admin-layout'

export default function Dashboard() {
  return <div>Dashboard</div>
}

// 這裡代表要套用AdminLayout，取代原本的DefaultLayout
// 要寫在元件的函式之外
Dashboard.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>
}
