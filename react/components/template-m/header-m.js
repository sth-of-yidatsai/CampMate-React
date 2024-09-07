import { useState } from 'react'

import styles from './header-m.module.css'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

import { useAuthTest, initUserData } from '@/hooks/use-auth-test'
import useFirebase from '@/hooks/use-firebase'
import { logout } from '@/services/user-test'

import { MdLogin } from 'react-icons/md'
import { MdLogout } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'

export default function HeaderM({
  labels = {
    user: { userName: '', userIcon: <></> },
    titles: [
      {
        lv1Name: '',
        lv1Icon: <></>,
        titleLv2: [{ lv2Name: '', lv2Icon: <></>, titleLv3: [] }],
      },
    ],
  },
}) {
  const { user, titles } = labels
  const { auth, setAuth } = useAuthTest()
  const { logoutFirebase } = useFirebase()

  const [toggles, setToggles] = useState({
    header: false,
  })

  const handleToggle = (target) => {
    setToggles({
      ...toggles,
      [target]: !toggles[target],
    })
  }

  // 判斷沒有登入，去登入
  const handleGoLogin = async () => {
    if (!auth.isAuth) {
      window.location.href = '/member-test/login'
    }
  }
  // 處理登出
  const handleLogout = async () => {
    // firebase logout(注意，這並不會登出google帳號，是登出firebase的帳號)
    logoutFirebase()

    const res = await logout()

    // 成功登出後，回復初始會員狀態
    if (res.data.status === 'success') {
      toast.success('已成功登出')

      setAuth({
        isAuth: false,
        userData: initUserData,
      })
    } else {
      toast.error(`登出失敗`)
    }
  }

  return (
    <>
      <div>
        <header className={styles.header}>
          <nav className={styles.navbar}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={144}
                height={13}
                fill="none"
                viewBox="0 0 160 16"
              >
                <g clipPath="url(#a)">
                  <path
                    fill="#413C1C"
                    d="M15.721 4.142c-1.627-1.68-4.028-1.929-5.313-1.929C7.194 2.213 3.76 3.734 3.76 8s3.433 5.787 6.654 5.787c1.285 0 3.685-.25 5.313-1.93l.15-.158 1.183.65-.26.276c-1.689 1.805-4.465 2.883-7.433 2.883C4.828 15.508 0 12.874 0 8 0 3.126 4.828.492 9.368.492c2.968 0 5.751 1.078 7.427 2.883l.26.276-1.184.65-.15-.159ZM28.816.547c1.033 0 1.675.401 1.97 1.217h.006c1.272 3.733 3.932 8.227 7.693 12.997l.377.478H34.58l-.09-.125C31.443 10.8 29.186 6.79 27.778 3.209c-1.573 3.975-3.727 7.888-6.544 11.905l-.09.124h-1.79l.341-.47c2.981-4.106 5.402-8.483 7.187-13.01.314-.837.903-1.21 1.935-1.21Zm27.845 0c-.403 0-.937.07-1.436.616l-4.24 4.39-.017.017c-.154.156-.501.508-.653.508-.04 0-.109-.014-.198-.104L45.85 1.467c-.608-.643-1.197-.92-1.962-.92-1.108 0-1.826.602-1.826 1.542v13.15h1.456V3.527l4.288 4.438c.39.395.84.581 1.381.581.609 0 1.067-.263 1.792-1.03l4.205-4.362v12.084h3.317V2.061c0-.917-.722-1.511-1.84-1.514Z"
                  />
                  <path
                    fill="#413C1C"
                    fillRule="evenodd"
                    d="M69.291 1.764c1.519-.657 2.866-.94 4.52-.94 4.808 0 7.673 2.343 7.673 6.104s-2.865 6.098-7.481 6.098c-2.387 0-4.315-.608-5.642-1.756v3.969h-3.316V1.48c0-.595.349-.934.97-.934.507 0 .849.25 1.136.83.26.49.588.747.971.747.26 0 .622-.111 1.17-.36Zm-.93 2.192v5.33c1.026 1.452 2.893 2.316 5.013 2.316 3.125 0 5.067-1.84 5.067-4.68 0-2.842-1.935-4.681-4.93-4.681-1.867 0-4.049.733-5.15 1.715Z"
                    clipRule="evenodd"
                  />
                  <path
                    fill="#413C1C"
                    d="M100.973.547c-.404 0-.937.07-1.436.616l-4.24 4.39-.017.017c-.154.156-.502.508-.653.508-.041 0-.11-.014-.198-.104l-4.267-4.507c-.61-.643-1.197-.92-1.963-.92-1.108 0-1.819.602-1.819 1.542v13.15h1.457V3.527l4.287 4.438c.39.395.841.581 1.381.581.609 0 1.067-.263 1.792-1.03l4.206-4.362v12.084h3.316V2.061c0-.92-.725-1.514-1.846-1.514Zm14.688 0c1.033 0 1.676.401 1.97 1.217h.006c1.272 3.733 3.932 8.227 7.693 12.997l.376.478h-4.28l-.089-.125c-3.05-4.314-5.307-8.324-6.715-11.905-1.573 3.975-3.727 7.888-6.544 11.905l-.089.124h-1.792l.342-.47c2.981-4.106 5.402-8.483 7.187-13.01.315-.837.903-1.21 1.935-1.21Zm10.654 1.749h5.197V15.24h3.317V2.296h5.197V.824h-13.711v1.472Z"
                  />
                  <path
                    fill="#413C1C"
                    fillRule="evenodd"
                    d="M151.774.547c4.841 0 8.219 3.063 8.219 7.453l.007-.014v.297h-12.958c.136 3.381 2.537 5.8 5.805 5.8 2.271 0 4.671-1.16 5.573-2.702l.144-.242 1.176.643-.171.27c-1.415 2.232-4.027 3.456-7.358 3.456-5.258 0-8.93-3.146-8.93-7.48 0-4.335 3.651-7.48 8.493-7.48Zm-4.712 6.326h9.416c-.123-2.897-1.99-4.888-4.656-4.888-2.667 0-4.63 2.04-4.76 4.888Z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 .492h160v15.016H0z" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div
              className={styles.header_logo_m_wrapper}
              onClick={() => handleToggle('header')}
            >
              <svg
                className={
                  toggles['header']
                    ? `${styles.header_logo_m} ${styles.open}`
                    : `${styles.header_logo_m}`
                }
                xmlns="http://www.w3.org/2000/svg"
                width={64}
                height={13}
                fill="none"
                viewBox="0 0 64 13"
              >
                <path
                  fill="#413C1C"
                  d="M0 12.757V9.718h64v3.04H0Zm0-9.039V.758h64v2.96H0Z"
                />
              </svg>
            </div>
          </nav>

          <nav
            className={
              toggles['header']
                ? `${styles.dropmenu} ${styles.open}`
                : `${styles.dropmenu}`
            }
          >
            <ul className="list-unstyled">
              {auth.isAuth ? (
                <li className={styles.userTitle}>
                  <div>Hi, {auth.userData.name}</div>
                  <Image
                    className={styles.userIcon}
                    width={64}
                    height={64}
                    src={auth.userData.photo_url}
                    alt=""
                  />
                </li>
              ) : (
                <li className={styles.mainTitle} onClick={handleGoLogin}>
                  <div className={styles.subTitleLv1}>
                    <div>Login</div>
                    <MdLogin />
                  </div>
                </li>
              )}

              {titles.map((lv1, i) => {
                return (
                  <li key={i} className={styles.mainTitle}>
                    <div
                      className={styles.subTitleLv1}
                      onClick={
                        lv1.titleLv2 === null
                          ? console.log('')
                          : () => handleToggle(lv1.lv1Name)
                      }
                    >
                      <div>{lv1.lv1Name}</div>
                      {lv1.lv1Icon}
                    </div>

                    {lv1.titleLv2 === null
                      ? ''
                      : lv1.titleLv2.map((lv2, i) => {
                          return (
                            <div
                              key={i}
                              className={
                                toggles[lv1.lv1Name]
                                  ? `${styles.lv2Wrapper} ${styles.open}`
                                  : `${styles.lv2Wrapper}`
                              }
                            >
                              <div
                                key={i}
                                className={styles.subTitleLv2}
                                onClick={() => handleToggle(lv2.lv2Name)}
                              >
                                {lv2.lv2Icon}
                                <div>{lv2.lv2Name}</div>
                              </div>
                              {lv2.titleLv3.map((lv3, i) => {
                                return (
                                  <div
                                    key={i}
                                    className={
                                      toggles[lv2.lv2Name]
                                        ? `${styles.lv3Wrapper} ${styles.open}`
                                        : `${styles.lv3Wrapper}`
                                    }
                                  >
                                    <div className={styles.subTitleLv3}>
                                      <div>{lv3}</div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                  </li>
                )
              })}
              {auth.isAuth ? (
                <li className={styles.mainTitle} onClick={handleLogout}>
                  <div className={styles.subTitleLv1}>
                    <div>Logout</div>
                    <MdLogout />
                  </div>
                </li>
              ) : (
                ''
              )}
            </ul>
          </nav>
        </header>
      </div>

      <div className={styles.header_space} />
    </>
  )
}
