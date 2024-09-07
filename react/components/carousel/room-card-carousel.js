import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'

//
import Lightbox from 'yet-another-react-lightbox'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

//
// import 'lightbox.js-react/dist/index.css'
// import { SlideshowLightbox } from 'lightbox.js-react'

//
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons'


const RoomCardCarousel = ({ slides, filteredRoomImg }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainViewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel(
    {
      containScroll: 'keepSnaps',
      axis: 'x',
      selectedClass: '',
      dragFree: true,
    },
    [ClassNames()]
  )

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // const toggleOpen = () => () => setOpen(!open)
  const toggleOpen2 = () => {
    setOpen(!open)
  }

  // const updateIndex = ({ index: current }) => setIndex(current)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(embla)

  const onThumbClick = useCallback(
    (index) => {
      if (!embla || !emblaThumbsApi) return
      embla.scrollTo(index)
    },
    [embla, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbsApi) return
    setSelectedIndex(embla.selectedScrollSnap())
    emblaThumbsApi.scrollTo(embla.selectedScrollSnap())
  }, [embla, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect)
  }, [embla, onSelect])

  return (
    <>
      <section className="carousels">
        <div className="carousels__carousel-main">
          <div className="carousel-main">
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
            <div className="carousel-main__viewport" ref={mainViewportRef}>
              <div className="carousel-main__container">
                {slides.map((index) => (
                  <div className="carousel-main__slide" key={index}>
                    <img
                      className="carousel-main__slide__img"
                      src={filteredRoomImg[index]}
                      alt="A cool cat."
                      onClick={() => {
                        setIndex(index)
                        toggleOpen2()
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="carousels__carousel-thumb">
          <div className="carousel-thumb">
            <div className="embla__buttons2">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
            <div className="carousel-thumb__viewport" ref={thumbViewportRef}>
              <div className="carousel-thumb__container">
                {slides.map((index) => (
                  <div
                    key={index}
                    className={`carousel-thumb__slide ${
                      index === selectedIndex ? 'selected' : ''
                    }`}
                  >
                    <button
                      className="carousel-thumb__slide__button"
                      onClick={() => onThumbClick(index)}
                      type="button"
                    >
                      <img
                        className="carousel-thumb__slide__img"
                        src={filteredRoomImg[index]}
                        alt="A cool cat."
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 
      <Lightbox
        open={open}
        close={() => toggleOpen2()}
        index={selectedIndex}
        slides={[
          { src: '/banner/chikawa0.jpg' },
          { src: '/banner/chikawa1.jpg' },
          { src: '/banner/chikawa2.jpg' },
          { src: '/banner/chikawa3.jpg' },
          { src: '/banner/chikawa4.jpg' },
          { src: '/banner/chikawa5.jpg' },
        ]}
        plugins={[Thumbnails]}
      /> */}
      {/* {slides.map((index) => (
                  <div className="carousel-main__slide" key={index}>
                    <SlideshowLightbox theme="lightbox">
                      <img
                        className="carousel-main__slide__img"
                        src={`/banner/chikawa${index}.jpg`}
                        alt="A cool cat."
                      />
                    </SlideshowLightbox>
                  </div>
                ))} */}
      <style jsx>{`
        .carousels {
          background-color: transparent;
          max-width: 873px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin-bottom: 32px;
        }

        .carousels__carousel-thumb {
          min-width: 205px;
          height: 100%;
        }

        .carousels__carousel-main {
          flex: 1 0 0;
        }

        .carousel-main,
        .carousel-thumb {
          position: relative;
          z-index: '5';
        }
        .embla__buttons {
          width: 115%;
          display: flex;
          justify-content: space-between;
          position: absolute;
          z-index: '1';
          top: 45%;
          left: -7.5%;
        }
        .embla__buttons2 {
          width: 115%;
          display: flex;
          justify-content: space-between;
          position: absolute;
          z-index: '1';
          top: 50%;
          left: -7.5%;
        }
        .carousel-main__viewport {
          overflow: hidden;
          height: 450px;
        }
        .carousel-thumb__viewport {
          overflow: hidden;
          height: 100%;
        }

        .carousel-main__container,
        .carousel-thumb__container {
          user-select: none;
          -webkit-touch-callout: none;
          -khtml-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .carousel-main__container {
          display: flex;
          height: 100%;
        }

        .carousel-thumb__container {
          display: flex;
          height: 80%;
          margin-top: 5%
        }

        .carousel-main__slide {
          position: relative;
          flex: 0 0 100%;
        }

        .carousel-main__slide__img {
          object-fit: cover;
          height: 100%;
          width: 100%;
          position: relative;
          z-index: 5;
          border-radius: 20px; 
        }

        .carousel-thumb__slide {
          height: 109px;
          width: 200px;
          margin-right: 22px;
        }

        .carousel-thumb__slide__img {
          object-fit: cover;
          width:200px;
          height: 100%;
          opacity: 0.2;
          border-radius: 20px; 
        }

        .carousel-thumb__slide__button {
          height: 100%;
          width: 100%;
          border: 0;
          outline: 0;
          margin: 0;
          padding: 0;
          display: flex;
          cursor: pointer;
          background-color: transparent;
          touch-action: manipulation;
          -webkit-appearance: none;
          position: relative;
          z-index: 1;
        }

        .carousel-thumb__slide.selected .carousel-thumb__slide__img {
          opacity: 1;
        }
      `}</style>
    </>
  )
}

export default RoomCardCarousel
