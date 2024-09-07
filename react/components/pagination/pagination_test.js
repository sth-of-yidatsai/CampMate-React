import { useEffect } from 'react'
import styles from './pagination.module.css'
import CustomSelect from './custom-select'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { MdKeyboardArrowRight } from 'react-icons/md'

const PaginationTest = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1)
    let end = Math.min(start + 4, totalPages)
    start = Math.max(end - 4, 1)

    // console.log(Array.from({ length: end - start + 1 }, (_, idx) => start + idx))

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
  }

  const pages = getPaginationGroup()
  console.log(pages)

  const options = Array.from({ length: totalPages }, (_, index) => ({
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
          onClick={() => {
            onPageChange(page)
            console.log(pages.length + '長度')
          }}
          className={currentPage === page ? styles.active : ''}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] !== totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className={styles.ellipsis}>...</span>
          )}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
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

export default PaginationTest
