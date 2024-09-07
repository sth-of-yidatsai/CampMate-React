import {
  updateProfile,
  getUserById,
  updateProfileAvatar,
} from '@/services/user'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import PreviewUploadImage from '@/components/user-test/preview-upload-image'
import { avatarBaseUrl } from '@/configs'

// 定義要在此頁呈現/編輯的會員資料初始物件
const initUserProfile = {
  name: '',
  sex: '',
  phone: '',
  birth_date: '',
  avatar: '',
}

export default function Profile() {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [hasProfile, setHasProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // !! 注意phone, birth_date...等資料並沒有在auth.userData中，需自行向伺服器獲取
  // 這裡的設計重點，是auth.userData或JWT存取令牌中，並不記錄"會改變"的會員資料(密碼當然更不行，會有安全性問題)
  // 因此更新會員資料與auth.userData或JWT存取令牌無關
  const getUserData = async (id) => {
    const res = await getUserById(id)

    console.log(res.data)

    if (res.data.status === 'success') {
      // 以下為同步化目前後端資料庫資料，與這裡定義的初始化會員資料物件的資料
      const dbUser = res.data.data.user
      const dbUserProfile = { ...initUserProfile }

      for (const key in dbUserProfile) {
        if (Object.hasOwn(dbUser, key)) {
          // 這裡要將null值的預設值改為空字串 ''
          dbUserProfile[key] = dbUser[key] || ''
        }
      }

      // 設定到狀態中
      setUserProfile(dbUserProfile)

      toast.success('會員資料載入成功')
    } else {
      toast.error(`會員資料載入失敗`)
    }
  }

  // auth載入完成後向資料庫要會員資料
  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
    // eslint-disable-next-line
  }, [auth])

  // 提示其它相關個人資料元件可以載入資料
  useEffect(() => {
    // 純粹觀察userProfile狀態變化用
    // console.log('userProfile狀態變化', userProfile)
    if (userProfile.name) {
      setHasProfile(true)
    }
  }, [userProfile])

  // 輸入一般資料用
  const handleFieldChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value })
  }

  // 送出表單用
  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 這裡可以作表單驗証

    // 送到伺服器進行更新
    // 更新會員資料用，排除avatar
    let isUpdated = false

    const { avatar, ...user } = userProfile
    const res = await updateProfile(auth.userData.id, user)

    // console.log(res.data)

    // 上傳頭像用，有選擇檔案時再上傳
    if (selectedFile) {
      const formData = new FormData()
      // 對照server上的檔案名稱 req.files.avatar
      formData.append('avatar', selectedFile)

      const res2 = await updateProfileAvatar(formData)

      // console.log(res2.data)
      if (res2.data.status === 'success') {
        toast.success('會員頭像修改成功')
      }
    }

    if (res.data.status === 'success') {
      toast.success('會員資料修改成功')
    } else {
      toast.error('會員資料修改失敗')
    }
  }

  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>

  return (
    <>
      <h1>會員資料修改(一般)</h1>
      <hr />
      <p>
        規則: username與email不能修改(這與註冊機制或網站會員的安全機制的有關)
      </p>
      <p>
        注意: 密碼不在這裡修改，因機制不一樣，在
        <Link href="/test/user/profile-password">會員資料修改(密碼)</Link>
      </p>
      <hr />
      {hasProfile ? (
        <PreviewUploadImage
          avatarImg={userProfile.avatar}
          // uploadImg={updateProfileAvatar}
          avatarBaseUrl={avatarBaseUrl}
          // toast={toast}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
      ) : (
        <div>
          <img src="/blank.webp" alt="" width="200" height="200" />
          <div>
            <button onClick={handleSubmit}> </button>
          </div>
        </div>
      )}
      <hr />
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            姓名
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          姓別
          <label>
            <input
              type="radio"
              name="sex"
              value="男"
              checked={userProfile.sex === '男'}
              onChange={handleFieldChange}
            />
            男
          </label>
          <label>
            <input
              type="radio"
              name="sex"
              value="女"
              checked={userProfile.sex === '女'}
              onChange={handleFieldChange}
            />
            女
          </label>
        </p>
        <p>
          <label>
            電話
            <input
              type="text"
              name="phone"
              value={userProfile.phone}
              onChange={handleFieldChange}
              maxLength={10}
            />
          </label>
        </p>
        <p>
          <label>
            生日
            <input
              type="date"
              name="birth_date"
              value={userProfile.birth_date}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <br />
        <button type="submit">修改</button>
        <br />
      </form>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
