import { useEffect } from 'react'
import { useLoader } from '@/hooks/use-loader'
import CardLoading from '@/components/loader/card-loading'

export default function Placeholder() {
  // 自訂控制開關載入動畫, showLoader是開載入動畫函式
  const { showLoader, loading } = useLoader()

  // didmount-初次渲染
  useEffect(() => {
    showLoader()
  }, [])

  // 如果是狀態初始化值，不呈現任何資料
  
  return (
    <>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {Array(40)
          .fill(1)
          .map((v, i) => {
            return <CardLoading key={i} loading={loading} />
          })}
      </div>
    </>
  )
}
