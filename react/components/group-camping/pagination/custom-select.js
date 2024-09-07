import React, { useState, useRef, useEffect } from 'react'
import { MdExpandMore } from 'react-icons/md'
import styles from './custom-select.module.css'

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef()

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.customSelect} ref={ref}>
      <div className={styles.selectedOption} onClick={handleToggle}>
        {/* {value.value} */}
        <MdExpandMore />
      </div>
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option)}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
