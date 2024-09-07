import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useRentcart } from '@/hooks/use-rentcart'

import useFirebase from '@/hooks/use-firebase'
import { useAuthTest, initUserData } from '@/hooks/use-auth-test'
import { logout } from '@/services/user-test'
import toast, { Toaster } from 'react-hot-toast'

import Link from 'next/link'

// MUI
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// icon
import { MdLogout } from 'react-icons/md'
import { HiHome } from 'react-icons/hi2'
import { RiCustomerService2Fill } from 'react-icons/ri'

export default function Header() {
  const { totalQty } = useRentcart()

  const { auth, setAuth } = useAuthTest()
  const { logoutFirebase } = useFirebase()

  // 控制大小 icon 開關
  const [isActive, setActive] = useState(false)

  const handleToggle = () => {
    setActive(!isActive)
  }

  const router = useRouter()

  // 點人像的跳出選項視窗
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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

  const goToCart = () => {
    if (!auth.isAuth) {
      alert(`請先登入`)
      return
    }
    router.push(`/rent_cart`)
  }

  return (
    <>
      {auth.isAuth ? (
        <Fragment>
          <Menu
            disableScrollLock={true}
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            autoFocus={false}
            PaperProps={{
              elevation: 0,
              sx: {
                borderRadius: '8px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 6,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              {auth.userData.photo_url ? (
                <img
                  src={auth.userData.photo_url}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginLeft: '-3px',
                    marginRight: '10px',
                  }}
                />
              ) : (
                <Avatar />
              )}
              {auth.userData.name}
            </MenuItem>
            <Link
              href={'/member-test/profile-test'}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={handleClose}>
                <HiHome
                  style={{
                    fontSize: '20px',
                    marginLeft: '2px',
                    marginRight: '13px',
                  }}
                />
                會員中心
              </MenuItem>
            </Link>
            {/* <Link
              href={'/custer-server/custerServer'}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={handleClose}>
                <RiCustomerService2Fill
                  style={{
                    fontSize: '20px',
                    marginLeft: '2px',
                    marginRight: '13px',
                  }}
                />
                客服中心
              </MenuItem>
            </Link> */}
            <Divider />
            <MenuItem
              onClick={() => {
                handleClose()
                handleLogout()
              }}
            >
              <ListItemIcon>
                <MdLogout
                  style={{
                    fontSize: '20px',
                    marginLeft: '2px',
                    marginRight: '13px',
                  }}
                />
              </ListItemIcon>
              登出
            </MenuItem>{' '}
          </Menu>
        </Fragment>
      ) : (
        ''
      )}

      <div>
        <header className="header">
          <nav className="navbar">
            <Link href={'/home'}>
              <div>
                <svg
                  className="header-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  width={160}
                  height={16}
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
            </Link>
            <div
              className={
                isActive ? 'nav-right-group open-menu' : 'nav-right-group'
              }
            >
              <div className="menu-btn" onClick={handleToggle}>
                <svg
                  className="menu-btn-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width={123}
                  height={40}
                  fill="none"
                  viewBox="0 0 123 40"
                >
                  <path
                    fill="#413C1C"
                    d="M40 26v-3.039h53V26H40Zm0-9.039V14h53v2.961H40Z"
                  />
                </svg>
              </div>
              <div className="icon-btn-group">
                <div
                  className={
                    isActive ? 'icon-btn-closed hidden-btn' : 'icon-btn-closed'
                  }
                >
                  <div
                    className="icon-btn"
                    onClick={(e) => {
                      handleClick(e)
                      handleGoLogin()
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <mask
                        id="a"
                        width={20}
                        height={20}
                        x={0}
                        y={0}
                        maskUnits="userSpaceOnUse"
                        style={{ maskType: 'alpha' }}
                      >
                        <path fill="#D9D9D9" d="M0 0h20v20H0z" />
                      </mask>
                      <g mask="url(#a)">
                        <path
                          fill="#413C1C"
                          d="M10 9.915c-.883 0-1.632-.307-2.247-.922S6.83 7.629 6.83 6.746c0-.883.307-1.631.922-2.245.615-.613 1.364-.92 2.247-.92.883 0 1.632.307 2.247.92.615.614.922 1.362.922 2.245s-.307 1.632-.922 2.247-1.364.922-2.247.922Zm-6.17 6.34v-2.18c0-.35.096-.681.287-.992.19-.31.453-.57.787-.778a10.462 10.462 0 0 1 2.458-1.03 9.82 9.82 0 0 1 2.634-.36 10.178 10.178 0 0 1 5.1 1.385c.334.194.596.45.787.766.191.316.286.653.286 1.008v2.18H3.831Zm1.73-1.73h8.88V14.1a.306.306 0 0 0-.063-.188.422.422 0 0 0-.166-.13 7.652 7.652 0 0 0-1.997-.85A8.503 8.503 0 0 0 10 12.643c-.757 0-1.495.096-2.214.287a7.47 7.47 0 0 0-1.997.85 1.12 1.12 0 0 0-.167.155.247.247 0 0 0-.062.164v.425Zm4.444-6.339c.397 0 .736-.141 1.016-.424.28-.283.42-.623.42-1.02a1.37 1.37 0 0 0-.424-1.014 1.401 1.401 0 0 0-1.02-.417 1.38 1.38 0 0 0-1.016.423c-.28.281-.42.62-.42 1.016 0 .398.141.736.424 1.016.283.28.623.42 1.02.42Z"
                        />
                      </g>
                    </svg>
                  </div>
                  <Link href={'/member-test/custerServer'}>
                    <div className="icon-btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <mask
                          id="a"
                          width={20}
                          height={20}
                          x={0}
                          y={0}
                          maskUnits="userSpaceOnUse"
                          style={{ maskType: 'alpha' }}
                        >
                          <path fill="#D9D9D9" d="M0 0h20v20H0z" />
                        </mask>
                        <g mask="url(#a)">
                          <path
                            fill="#413C1C"
                            d="M5 12h7v-1.5H5V12Zm0-2.75h10v-1.5H5v1.5ZM5 6.5h10V5H5v1.5ZM2 18V3.5c0-.413.147-.766.44-1.06.294-.293.647-.44 1.06-.44h13c.413 0 .766.147 1.06.44.293.294.44.647.44 1.06v10c0 .412-.147.766-.44 1.06-.294.293-.647.44-1.06.44H5l-3 3Zm2.375-4.5H16.5v-10h-13v10.875l.875-.875Z"
                          />
                        </g>
                      </svg>
                    </div>
                  </Link>

                  <div
                    onClick={() => {
                      auth.isAuth ? goToCart() : toast.error(`請先登入`)
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                      }}
                      className="icon-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <mask
                          id="a"
                          width={20}
                          height={20}
                          x={0}
                          y={0}
                          maskUnits="userSpaceOnUse"
                          style={{ maskType: 'alpha' }}
                        >
                          <path fill="#D9D9D9" d="M0 0h20v20H0z" />
                        </mask>
                        <g mask="url(#a)">
                          <path
                            fill="#413C1C"
                            d="M5.496 18.075c-.414 0-.767-.148-1.058-.442A1.456 1.456 0 0 1 4 16.57c0-.413.147-.766.442-1.058a1.456 1.456 0 0 1 1.062-.437c.414 0 .767.147 1.059.442.291.294.437.648.437 1.062 0 .414-.147.767-.442 1.058a1.456 1.456 0 0 1-1.062.438Zm9 0c-.414 0-.767-.148-1.059-.442A1.456 1.456 0 0 1 13 16.57c0-.413.147-.766.442-1.058a1.456 1.456 0 0 1 1.062-.437c.414 0 .767.147 1.059.442.291.294.437.648.437 1.062 0 .414-.147.767-.442 1.058a1.456 1.456 0 0 1-1.062.438Zm-9.1-12.5 1.614 3.77h6.25l1.58-3.77H5.395Zm-.726-1.65h11.686c.253 0 .44.102.56.304a.65.65 0 0 1 .032.634l-2.205 5.177a1.61 1.61 0 0 1-.572.698 1.484 1.484 0 0 1-.86.262H6.689l-.83 1.425h10.216v1.65H5.75c-.634 0-1.1-.265-1.398-.793-.298-.529-.292-1.053.016-1.572l1.068-1.835-2.69-6.3H.927v-1.65h2.89l.854 2Z"
                          />
                        </g>
                      </svg>
                      {auth.isAuth && totalQty > 0 && (
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            color: '#f5f5f7',
                            position: 'fixed',
                            top: '15px',
                            right: '70px',
                            zIndex: '10',
                            backgroundColor: '#de3e3e',
                            borderRadius: '100%',
                            lineHeight: '18px',
                            textAlign: 'center',
                          }}
                          className="p3-en-tian"
                        >
                          {totalQty}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    isActive
                      ? 'icon-btn-opened-group'
                      : 'icon-btn-opened-group hidden-btn'
                  }
                >
                  <Link href={'/rent'} style={{ textDecoration: 'none' }}>
                    <div className="icon-btn-opened">
                      <p>RENT</p>
                    </div>
                  </Link>
                  <Link
                    href={'/campground/campground-home'}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="icon-btn-opened">
                      <p>GROUND</p>
                    </div>
                  </Link>
                  <Link
                    href={'/group-camping'}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="icon-btn-opened">
                      <p>GROUP</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
      <div className="header-space" />
    </>
  )
}
