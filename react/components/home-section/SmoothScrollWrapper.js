// SmoothScrollWrapper.js
import React, { useEffect, useRef } from 'react'
import { useScrollContext } from '@/context/ScrollContext'
import debounce from 'lodash.debounce'

const SmoothScrollWrapper = ({ children }) => {
  const { sectionsRef, setCurrentSection, currentSection } = useScrollContext()
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleWheel = debounce((event) => {
      if (isScrolling.current) return
      isScrolling.current = true

      const currentIndex = currentSection

      if (event.deltaY > 0 && currentIndex < sectionsRef.current.length - 1) {
        // 向下滾動
        window.scrollTo({
          top: sectionsRef.current[currentIndex + 1].offsetTop,
          behavior: 'smooth',
        })
        setCurrentSection(currentIndex + 1)
      } else if (event.deltaY < 0 && currentIndex > 0) {
        // 向上滾動
        window.scrollTo({
          top: sectionsRef.current[currentIndex - 1].offsetTop,
          behavior: 'smooth',
        })
        setCurrentSection(currentIndex - 1)
      }

      setTimeout(() => {
        isScrolling.current = false
      }, 1000)
    }, 100)

    window.addEventListener('wheel', handleWheel)

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [sectionsRef, setCurrentSection, currentSection])

  useEffect(() => {
    sectionsRef.current = sectionsRef.current.slice(
      0,
      React.Children.count(children)
    )
  }, [children])

  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          ref: (el) => (sectionsRef.current[index] = el),
          id: `Section ${index + 1}`,
        })
      )}
    </div>
  )
}

export default SmoothScrollWrapper
