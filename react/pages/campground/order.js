import { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthTest } from '@/hooks/use-auth-test'
import axiosInstance from '@/services/axios-instance'
import toast, { Toaster } from 'react-hot-toast'

// 轉圈圈
import { FadeLoader } from 'react-spinners'

// MUI
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})

const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})

const OrderCard = dynamic(() => import('@/components/card/order-card'), {
  ssr: false,
})

const ConfirmCard = dynamic(() => import('@/components/card/confirm-card'), {
  ssr: false,
})

const OrderCompleteCard = dynamic(
  () => import('@/components/card/order-complete-card'),
  {
    ssr: false,
  }
)

const stepStyle = {
  width: '1070px',
  margin: 'auto',
  fontFamily: 'Noto Sans TC',
  '& .Mui-disabled': {
    '& .MuiStepLabel-iconContainer': {
      '& .MuiSvgIcon-root': {
        color: '#E5E4CF',
        fontSize: '41px',
        borderRadius: '50%',
        border: '3px solid #E49366',
        '& text': {
          fill: '#E49366',
          fontSize: '12px',
          top: '2px',
        },
      },
    },
    '& .MuiStepLabel-labelContainer': {
      '& .MuiStepLabel-label': {
        color: '#8F8E93',
        fontFamily: 'Noto Sans TC',
        fontSize: '16px',
        fontWeight: '500',
      },
    },
  },
  '& .MuiStepLabel-labelContainer': {
    '& .MuiStepLabel-label': {
      color: '#8F8E93',
      fontFamily: 'Noto Sans TC',
      fontSize: '16px',
      fontWeight: '500',
    },
  },
  '& .Mui-active': {
    '&.MuiStepIcon-root': {
      color: '#E49366',
      fontSize: '43px',
      // border: '2px solid black',
      // borderRadius: '50%',
      '& text': {
        fontSize: '12px',
      },
    },
    '& .MuiStepConnector-line': {
      borderColor: '#E49366',
    },
  },
  '& .Mui-completed': {
    '&.MuiStepIcon-root': {
      color: '#30B235',
      fontSize: '43px',
      '& text': {
        fontSize: '12px',
      },
    },
    '& .MuiStepConnector-line': {
      borderColor: '#E49366',
    },
  },
}

const override = {
  display: 'block',
  margin: 'auto',
  marginTop: '50vh',
  // borderColor: 'red',
}

export default function Template() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // Carousel
  const OPTIONS = { loop: true }
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  // 讀取 local
  const [orderInfo, setOrderInfo] = useState({})

  // 如果沒有登入，會進入 loading 再跳回 login 畫面
  const { auth, isLoading, setIsLoading } = useAuthTest()

  // confirm回來用的，在記錄確認之後，line-pay回傳訊息與代碼，例如
  // {returnCode: '1172', returnMessage: 'Existing same orderId.'}
  const [result, setResult] = useState({
    returnCode: '',
    returnMessage: '',
  })

  // ORDER CARD 狀態
  const initData = {
    lastName: auth.userData.name,
    firstName: ' ',
    phone: auth.userData.phone,
    email: auth.userData.email,
    note: '',
  }
  const [data, setData] = useState(initData)

  // Stepper
  const steps = ['訂單資訊確認', '填寫付款資訊', '完成訂房']

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    window.scrollTo({
      top: document.querySelector(`.title`).offsetTop - 64, // 偏移?px
      left: 0,
      behavior: 'smooth', // 平滑滾動
    })

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    window.scrollTo({
      top: document.querySelector(`.title`).offsetTop - 64, // 偏移?px
      left: 0,
      behavior: 'smooth', // 平滑滾動
    })
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  useEffect(() => {
    setIsLoading(true)
    const info = JSON.parse(localStorage.getItem('orderInfo')) || {}
    if (info) {
      setOrderInfo(info)
    }
    return () => {
      // 檢查是否包含 linepay 或者 ecpay 的 query string，有的話就在離開頁面時移除localStorage
      if (router.query.RtnCode || router.query.transactionId) {
        localStorage.clear()
        // 清除所有的 localStorage 数据
      }
    }
  }, [])

  // 確認交易，處理伺服器通知line pay已確認付款，為必要流程
  const handleConfirm = async (transactionId) => {
    const res = await axiosInstance.get(
      `/camp-line-pay/confirm?transactionId=${transactionId}`
    )

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('付款成功')
    } else {
      toast.error('付款失敗')
    }

    if (res.data.data) {
      setResult(res.data.data)
    }

    // 處理完畢，關閉載入狀態
    setIsLoading(false)
  }

  // ecpay 付款成功後，回來 post 到訂單改變 status
  const router = useRouter()
  useEffect(() => {
    if (router.isReady) {
      console.log(router.query.RtnCode)
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      if (router.query.RtnCode || router.query.transactionId) {
        console.log('你已經付款成功咯')
        setActiveStep(2)
      }
      // 向server發送確認交易api
      if (router.query.transactionId) {
        handleConfirm(router.query.transactionId)
      }
    }
  }, [router.isReady])

  // 轉圈圈
  const loader = (
    <FadeLoader
      color="#574426"
      loading={isLoading}
      cssOverride={override}
      size={30}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )

  if (isLoading) {
    return <>{loader}</>
  }

  return (
    <>
      <Toaster />
      <div className="body">
        {isDesktopOrLaptop && <Header />}
        {/* 請按照下列格式填入需要的欄位 */}
        {isTabletOrMobile && (
          <HeaderM
            labels={{
              user: { userName: '王小明', userIcon: myIcon },
              titles: [
                {
                  lv1Name: 'Customer Center',
                  lv1Icon: <FaRegUser style={{ fill: '#413c1c' }} />,
                  // 沒有lv2的話請填入null
                  titleLv2: null,
                },
                {
                  lv1Name: 'Rent',
                  lv1Icon: <MdOutlineChair style={{ fill: '#413c1c' }} />,
                  titleLv2: [
                    {
                      lv2Name: '帳篷',
                      lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                      titleLv3: [
                        '單/雙人',
                        '家庭',
                        '寵物',
                        '客廳帳/天幕',
                        '配件',
                        '其他',
                      ],
                    },
                    {
                      lv2Name: '戶外家具',
                      lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                      titleLv3: ['露營椅', '露營桌', '其他'],
                    },
                  ],
                },
                {
                  lv1Name: 'Ground',
                  lv1Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                  titleLv2: [
                    {
                      lv2Name: '營地主後台',
                      lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                      titleLv3: [],
                    },
                  ],
                },
              ],
            }}
          />
        )}

        <main
          style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            maxWidth: '1440px',
            margin: '24px auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginInline: '80px',
              width: '100%',
            }}
          >
            <div className="bread-crumb">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <mask
                  id="a"
                  width={24}
                  height={24}
                  x={0}
                  y={0}
                  maskUnits="userSpaceOnUse"
                  style={{ maskType: 'alpha' }}
                >
                  <path fill="#D9D9D9" d="M0 0h24v24H0z" />
                </mask>
                <g mask="url(#a)">
                  <path
                    fill="#8F8E93"
                    d="M9.461 12.654h1.693v-2.365h1.692v2.365h1.693V8.596L12 6.904 9.461 8.596v4.058ZM12 19.677c1.88-1.636 3.365-3.3 4.458-4.992 1.092-1.691 1.638-3.154 1.638-4.389 0-1.83-.579-3.34-1.737-4.53C15.2 4.576 13.747 3.981 12 3.981c-1.748 0-3.2.595-4.359 1.785-1.158 1.19-1.737 2.7-1.737 4.53 0 1.235.546 2.698 1.638 4.39 1.093 1.691 2.579 3.355 4.458 4.991Zm0 1.342c-2.35-2.078-4.12-4.016-5.31-5.814-1.191-1.798-1.786-3.434-1.786-4.909 0-2.115.689-3.86 2.066-5.234C8.348 3.686 10.024 3 12 3c1.976 0 3.652.687 5.03 2.061 1.377 1.375 2.066 3.12 2.066 5.235 0 1.475-.595 3.11-1.785 4.909-1.19 1.798-2.961 3.736-5.311 5.814Z"
                  />
                </g>
              </svg>
              <span>
                <Link
                  href={'/campground/campground-home'}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  HOME{' '}
                </Link>
                \ GROUND
              </span>
            </div>
            <div className="title">付款資訊。</div>
            <div style={{ marginInline: 'auto' }}>
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} sx={stepStyle}>
                  {steps.map((label, index) => {
                    const stepProps = {}
                    const labelProps = {}
                    if (isStepSkipped(index)) {
                      stepProps.completed = false
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    )
                  })}
                </Stepper>
                {activeStep === steps.length ? (
                  <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      {activeStep === 0 ? (
                        <ConfirmCard
                          handleNext={handleNext}
                          data={data}
                          setData={setData}
                          orderInfo={orderInfo}
                        />
                      ) : (
                        ''
                      )}
                      {activeStep === 1 ? (
                        <OrderCard
                          data={data}
                          handleBack={handleBack}
                          handleNext={handleNext}
                          setData={setData}
                          orderInfo={orderInfo}
                        />
                      ) : (
                        ''
                      )}
                      {activeStep === 2 ? (
                        <OrderCompleteCard data={data} orderInfo={orderInfo} />
                      ) : (
                        ''
                      )}
                    </Typography>
                    
                  </Fragment>
                )}
              </Box>
            </div>
          </div>
        </main>

        {isDesktopOrLaptop && <Footer />}
        {isTabletOrMobile && <FooterM />}
      </div>

      <style jsx>
        {`
          .title {
            width: 1280x;
            font-family: 'Noto Sans TC';
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
          }
        `}
      </style>
    </>
  )
}
