import { useAuth } from '@/hooks/use-auth'
import { addFav, removeFav } from '@/services/user'
import toast from 'react-hot-toast'

// 愛心圖示(svg)
const Heart = ({ size = 20, color = 'red' }) => (
  <svg
    className="heart"
    viewBox="0 0 32 29.6"
    style={{ width: size, fill: color, stroke: 'red', position: 'relative' }}
  >
    <path d="M23.6 0c-3.4 0-6.3 2.7-7.6 5.6C14.7 2.7 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 9.5 11.9 16 21.2 6.1-9.3 16-12.1 16-21.2C32 3.8 28.2 0 23.6 0z" />
  </svg>
)

export default function FavFcon({ id }) {
  // 由context取得auth-判斷是否能執行add或remove用，favorites決定愛心圖案用
  const { auth, favorites, setFavorites } = useAuth()

  const handleTriggerFav = (pid) => {
    // 在陣列中->移出
    if (favorites.includes(pid)) {
      setFavorites(favorites.filter((v) => v !== pid))
    } else {
      //不在陣列中加入
      setFavorites([...favorites, pid])
    }
  }

  const handleAddFav = async (pid) => {
    const res = await addFav(pid)

    if (res.data.status === 'success') {
      // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
      handleTriggerFav(pid)
      toast.success(`商品 id=${pid} 新增成功!`)
    }
  }

  const handleRemoveFav = async (pid) => {
    const res = await removeFav(pid)

    if (res.data.status === 'success') {
      // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
      handleTriggerFav(pid)
      toast.success(`商品 id=${pid} 刪除成功!`)
    }
  }

  return (
    <>
      {/* 由favorites狀態決定呈現實心or空心愛愛圖示 */}
      {favorites.includes(id) ? (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => {
            // 沒登入不能用
            if (!auth.isAuth) {
              return toast.error('會員才能使用!')
            }

            handleRemoveFav(id)
          }}
        >
          <Heart />
        </button>
      ) : (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => {
            // 沒登入不能用
            if (!auth.isAuth) {
              return toast.error('會員才能使用!')
            }

            handleAddFav(id)
          }}
        >
          <Heart color="white" />
        </button>
      )}
    </>
  )
}
