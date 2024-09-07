import React, { useCallback, useEffect, useRef } from 'react'
import Product_banner from '../tian/rent/product_banner'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'

const TWEEN_FACTOR_BASE = 0.84

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ])
  const tweenFactor = useRef(0)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenOpacity = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const opacity = numberWithinRange(tweenValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity)
  }, [emblaApi, tweenOpacity])

  return (
    <>
      <div className="wrapper">
        <p className="title-of-discount">
          限時活動優惠。<span>來看看有哪些優惠。</span>
        </p>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '60px',
          }}
        >
          {/* <Product_banner /> */}
        </div>
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {slides.map((index) => (
                <div className="embla__slide" key={index}>
                  <div className="banner">
                    <img
                      className="embla__slide__img"
                      src={`/tian/test/banner_0${index+1}.png`}
                      alt="Your alt text"
                    />
                    <div className="box">
                      <div className="bannerBtn">
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
                              fill="#2D2D2D"
                              d="M6.294 17.644 5.25 16.6l9.84-9.85H6.145v-1.5h11.5v11.5h-1.5V7.804l-9.85 9.84Z"
                            />
                          </g>
                        </svg>
                      </div>
                      <div className="text-group">
                        <div className="box-title">盛夏露營季 5 折起</div>
                        <div className="box-desc">打卡送 1000 元禮包</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="embla__controls">
            <div className="embla__buttons">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .wrapper {
            margin-block: 32px;
            width: 1440px;
            padding: 0 80px;
          }
          .title-of-discount {
            font-family: 'Noto Sans TC';
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            margin-bottom: 48px;
            span {
              color: #8f8e93;
            }
          }
          .embla {
            max-width: 48rem;
            --slide-height: 19rem;
            --slide-spacing: 1rem;
            --slide-size: 70%;
            margin: auto;
          }
          .embla__viewport {
            overflow: hidden;
          }
          .embla__container {
            backface-visibility: hidden;
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
            margin: auto;
          }
          .embla__slide {
            flex: 0 0 100%;
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__slide__img {
            border-radius: 1.8rem;
            display: block;
            height: 16rem;
            width: 100%;
            object-fit: cover;
          }
          .embla__controls {
            position: relative;
            width: 100%;
          }
          @media screen and (max-width: 900px) {
            .embla__controls {
              display: none;
            }
            .wrapper {
              margin-block: 16px;
              width: 390px;
              padding: 0 16px;
            }
            .title-of-discount {
              display: flex;
              flex-direction: column;
              gap:8px;
              font-family: 'Noto Sans TC';
              font-size: 20px;
              font-style: normal;
              font-weight: 700;
              margin-bottom: 0px;
              span {
                color: #8f8e93;
              }
            }
          }
          .embla__buttons {
            position: absolute;
            bottom: 108px;
            left: -100px;
            width: 968px;
            display: flex;
            justify-content: space-between;
          }
          .embla__button {
            -webkit-tap-highlight-color: rgba(
              var(--text-high-contrast-rgb-value),
              0.5
            );
            -webkit-appearance: none;
            appearance: none;
            background-color: transparent;
            touch-action: manipulation;
            display: inline-flex;
            text-decoration: none;
            cursor: pointer;
            border: 0;
            padding: 0;
            margin: 0;
            box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
            width: 3.6rem;
            height: 3.6rem;
            z-index: 1;
            border-radius: 50%;
            color: var(--text-body);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .embla__button:disabled {
            color: var(--detail-high-contrast);
          }
          .embla__button__svg {
            width: 35%;
            height: 35%;
          }
          // banner 小卡
          .banner {
            position: relative;
          }
          .bannerBtn {
            width: 56px;
            height: 56px;
            background-color: #e5e4cf;
            display: grid;
            place-items: center;
            border-radius: 18px;
            cursor: pointer;
          }
          .box {
            position: absolute;
            top: 0;
            right: 0px;
            width: 199px;
            height: 256px;
            padding: 16px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: end;
          }

          .text-group {
            text-align: center;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: white;
          }
          .box-title {
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
          }
          .box-desc {
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
        `}
      </style>
    </>
  )
}

export default EmblaCarousel
