import { useShip711StoreCallback } from '@/hooks/use-ship-711-store'

export default function Callback() {
  // 呼叫回送到母視窗用的勾子函式
  useShip711StoreCallback()

  return (
    <>
      {/* 以下並非必要，可寫可不寫。只是為了自動關閉功能出意外時手動使用 */}
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column">
          <p className="text-center">
            <button
              onClick={() => {
                window.close()
              }}
            >
              關閉視窗
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

// 去除上下選單的版型，套用layout用
Callback.getLayout = function (page) {
  return (
    <main className="flex-shrink-0 mt-3">
      <div className="container-fluid m-0 p-0">{page}</div>
    </main>
  )
}
