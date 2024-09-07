import React, { useCallback, useEffect, useState } from 'react'

export const usePrevNextButtons = (emblaApi, onButtonClick) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  }
}

export const VerPrevButton = (props) => {
  const { children, ...restProps } = props

  return (
    <>
      <button
        className="embla__button embla__button--prev"
        type="button"
        {...restProps}
      >
        <svg className="embla__button__svg" viewBox="0 0 532 532">
          <path
            fill="currentColor"
            d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
          />
        </svg>
        {children}
      </button>
      <style jsx>
        {`
          .embla {
            max-width: 48rem;
            --slide-height: 19rem;
            --slide-spacing: 1rem;
            --slide-size: 70%;
            padding: 10px;
          }
          .embla__viewport {
            overflow: hidden;
          }
          .embla__container {
            backface-visibility: hidden;
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
          }
          .embla__slide {
            flex: 0 0 100%;
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__slide__img {
            border-radius: 1.8rem;
            display: block;
            height: var(--slide-height);
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
          }
          .embla__buttons {
            position: absolute;
            bottom: 152px;
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
            transform: rotate(90deg);
          }
          .embla__button:disabled {
            color: var(--detail-high-contrast);
          }
          .embla__button__svg {
            width: 35%;
            height: 35%;
          }
        `}
      </style>
    </>
  )
}

export const VerNextButton = (props) => {
  const { children, ...restProps } = props

  return (
    <>
      <button
        className="embla__button embla__button--next"
        type="button"
        {...restProps}
      >
        <svg className="embla__button__svg" viewBox="0 0 532 532">
          <path
            fill="currentColor"
            d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
          />
        </svg>
        {children}
      </button>
      <style jsx>
        {`
          .embla {
            max-width: 48rem;
            --slide-height: 19rem;
            --slide-spacing: 1rem;
            --slide-size: 70%;
          }
          .embla__viewport {
            overflow: hidden;
          }
          .embla__container {
            backface-visibility: hidden;
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
          }
          .embla__slide {
            flex: 0 0 100%;
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__slide__img {
            border-radius: 1.8rem;
            display: block;
            height: var(--slide-height);
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
          }
          .embla__buttons {
            position: absolute;
            bottom: 152px;
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
            transform: rotate(90deg);
          }
          .embla__button:disabled {
            color: var(--detail-high-contrast);
          }
          .embla__button__svg {
            width: 35%;
            height: 35%;
          }
        `}
      </style>
    </>
  )
}
