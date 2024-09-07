import React from 'react'

export default function Page_title({ pageTitle }) {
  return (
    <>
      <div className="pageTitle-tian">
        <span className="h5-tc-tian dark-text-tian">{pageTitle.title}</span>
        <span className="p1-tc-tian sub-text-tian">{pageTitle.subTitle}</span>
      </div>
    </>
  )
}
