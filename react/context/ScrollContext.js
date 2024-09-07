// ScrollContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react'

const ScrollContext = createContext()

export const ScrollProvider = ({ children }) => {
  const sectionsRef = useRef([])
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const sectionTops = sectionsRef.current.map((section) =>
        section ? section.offsetTop : 0
      )
      const scrollPosition = window.scrollY + window.innerHeight / 2
      const newIndex = sectionTops.findIndex(
        (top, index) =>
          scrollPosition >= top &&
          (index === sectionsRef.current.length - 1 ||
            scrollPosition < sectionTops[index + 1])
      )
      if (newIndex !== -1 && newIndex !== currentSection) {
        setCurrentSection(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSection])

  return (
    <ScrollContext.Provider
      value={{ sectionsRef, currentSection, setCurrentSection }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
