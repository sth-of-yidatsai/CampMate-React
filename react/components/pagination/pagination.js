import React from 'react'
import styles from './pagination.module.css'
import CustomSelect from './custom-select'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { MdKeyboardArrowRight } from 'react-icons/md'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const correctedTotalPages = Math.max(totalPages, 1) // 沒資料，保底1頁

  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1)
    let end = Math.min(start + 4, correctedTotalPages)
    start = Math.max(end - 4, 1)

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
  }

  const pages = getPaginationGroup()

  const options = Array.from({ length: correctedTotalPages }, (_, index) => ({
    value: index + 1,
    label: `Page ${index + 1}`,
  }))

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft />
      </button>
      {pages[0] !== 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? styles.active : ''}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] !== correctedTotalPages && (
        <>
          {pages[pages.length - 1] < correctedTotalPages - 1 && (
            <span className={styles.ellipsis}>...</span>
          )}
          <button onClick={() => onPageChange(correctedTotalPages)}>
            {correctedTotalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === correctedTotalPages}
      >
        <MdKeyboardArrowRight className={styles.pageIcon} />
      </button>
      <div className={styles.pageSelecter}>
        前往頁面：
        <CustomSelect
          value={{ value: currentPage }}
          onChange={(option) => onPageChange(option.value)}
          options={options}
        />
      </div>
    </div>
  )
}

export default Pagination
