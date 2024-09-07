import React, { useState } from 'react'

import Lightbox from 'yet-another-react-lightbox'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

export default function LightBox2() {
  return (
    <>
      <div className={`lightBox-tian`}>
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
            position: 'bottom',
            width: 'fit-content',
            border: '1',
            borderColor: '#f5f5f7',
            borderRadius: '18',
            imageFit: 'contain',
          }}
          slides={[
            { src: '/group-camping/group-camping-01.jpg' },
            { src: '/group-camping/group-camping-02.jpg' },
            { src: '/group-camping/group-camping-03.jpg' },
            { src: '/group-camping/group-camping-04.jpg' },
            { src: '/group-camping/group-camping-05.jpg' },
          ]}
        />
      </div>
    </>
  )
}
