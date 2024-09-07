import Offcanvas from 'react-bootstrap/Offcanvas'
import Accordion from 'react-bootstrap/Accordion'
import { useRouter } from 'next/router'

export default function ToturialPanel({ show, handleClose }) {
  const router = useRouter()

  const tutorials = [
    {
      title: '1. 會員相關',
      content: (
        <>
          網站會員功能測試展示，需配合各教學文件說明。以下為考慮實作整合上，從容易到困難的大致排列。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/register')
                }}
              >
                a-1. 註冊
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/profile')
                }}
              >
                a-2. 資料修改-一般資料
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/profile-password')
                }}
              >
                a-3. 資料修改-密碼
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user')
                }}
              >
                b. 登入/登出/隱私路由跳轉
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/google-login')
                }}
              >
                c. 第三方整合 - Google
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/forget-password')
                }}
              >
                d. 忘記密碼(OTP, 一次性密碼)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/user/line-login')
                }}
              >
                e. 其它-第三方整合 - Line
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '2. 前端全域載入動畫',
      content: (
        <>
          此勾子與後端無關。展示前端(React/
          Next)應用程式，與後端API正進行fetch時，撥放全站圖層覆蓋式的動畫，提示使用者正在fetch資料中。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/loader')
                }}
              >
                a. 展示(/loader)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/loader/placeholder')
                }}
              >
                b. 商品卡片展示(/placeholder)
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '3. 7-11 運送商店選擇',
      content: (
        <>
          請勿用於正式網站，這並不是正式的7-11運送API，只能作為簡單展示。此功能需要後端(node/express)配合才能使用，但與資料庫無關，目前只能用於PC展示上(手機頁面可能無法正確呈現)。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/ship')
                }}
              >
                a. 展示(/ship)
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '4. 購物車',
      content: (
        <>
          使用LocalStorage記錄的購物車範例。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/cart')
                }}
              >
                a. 展示(/cart)
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '5. 加入我的最愛範例',
      content: (
        <>
          加入我的最愛(願望清單、書籤、待購清單…)範例。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/fav/')
                }}
              >
                a. 展示(/fav)
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '6. Line Pay',
      content: (
        <>
          Line Pay範例。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/line-pay/order')
                }}
              >
                a. 展示(/line-pay/order)
              </button>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '7. 商品過濾範例',
      content: (
        <>
          商品過濾範例。
          <ul>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/product/')
                }}
              >
                a. 一般展示(/product/)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/product/list')
                }}
              >
                b-1. 列表卡片(/product/list)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/product/list/loading')
                }}
              >
                b-2. 列表卡片+載入佔位符
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  handleClose()
                  router.push('/test/product/infinite-scroll')
                }}
              >
                c. 無限捲動(/product/infinite-scroll)
              </button>
            </li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>測試展示</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion flush>
            {tutorials.map((v, i) => {
              return (
                <Accordion.Item eventKey={i} key={i}>
                  <Accordion.Header>{v.title}</Accordion.Header>
                  <Accordion.Body>{v.content}</Accordion.Body>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
