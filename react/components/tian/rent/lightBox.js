import React, { useState } from 'react'

import { useQuery } from '@/hooks/use-query'

import Lightbox from 'yet-another-react-lightbox'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

// import styles from './lightBox.module.css'

export default function LightBox() {
  const { devPic, setDevPic, mainPic, setMainPic } = useQuery()

  let srcArr = []
  mainPic.forEach((pic) => {
    srcArr.push({ src: `/tian/image/${pic.image_path}` })
  })
  devPic.forEach((pic) => {
    srcArr.push({ src: `/tian/image/${pic.image_path}` })
  })

  return (
    <>
      <div className="lightBox-tian">
        <Lightbox
          plugins={[Inline, Thumbnails, Fullscreen]}
          inline={{
            style: {
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '1 / 1',
              backgroundColor: '#f5f5f7',
              margin: '0,auto',
              borderRadius: '18',
            },
          }}
          thumbnails={{
            width: 'fit-content',
            border: '1',
            borderColor: '#f5f5f7',
            borderRadius: '18',
            imageFit: 'contain',
          }}
          slides={srcArr}
        />
      </div>
    </>
  )
}
