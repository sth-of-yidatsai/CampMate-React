// import { useState, useRef } from 'react'
// import styles from './lightbox.module.css'

// import Lightbox from 'yet-another-react-lightbox'
// import Inline from 'yet-another-react-lightbox/plugins/inline'
// import 'yet-another-react-lightbox/styles.css'
// import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
// import 'yet-another-react-lightbox/plugins/thumbnails.css'

// // React Photo Album
// import { ColumnsPhotoAlbum } from 'react-photo-album'
// import 'react-photo-album/columns.css'

// // Embla
// import VerticalCarousel from '../carousel/verticalCarousel'

// import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

// export default function ImageBar() {
//   const [open, setOpen] = useState(false)
//   const [index, setIndex] = useState(0)

//   const toggleOpen = () => () => setOpen(!open)

//   const updateIndex = ({ index: current }) => setIndex(current)

//   const photos = [
//     { src: '/banner/chikawa0.jpg', width: 205, height: 148 },
//     { src: '/banner/chikawa1.jpg', width: 205, height: 148 },
//     { src: '/banner/chikawa2.jpg', width: 205, height: 148 },
//   ]

//   const OPTIONS = { axis: 'y', dragFree: true, loop: true }
//   const SLIDE_COUNT = 5
//   const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

//   return (
//     <>
//       <div className="wrapper">
//         <Lightbox
//           className={styles.lightbox}
//           render={{
//             iconPrev: () => <BsChevronLeft />,
//             iconNext: () => <BsChevronRight />,
//           }}
//           plugins={[Inline]}
//           styles={{ container: { backgroundColor: 'transparent' } }}
//           index={index}
//           slides={[
//             { src: '/banner/chikawa0.jpg' },
//             { src: '/banner/chikawa1.jpg' },
//             { src: '/banner/chikawa2.jpg' },
//           ]}
//           on={{
//             view: updateIndex,
//             click: toggleOpen(true),
//           }}
//           carousel={{
//             padding: 0,
//             spacing: 0,
//             imageFit: 'cover',
//           }}
//           inline={{
//             style: {
//               width: '100%',
//               maxWidth: '900px',
//               aspectRatio: '3 / 2',
//               margin: '0 auto',
//             },
//           }}
//         />
//         <div style={{ width: '250px', overflow: 'hidden' }}>
//           <ColumnsPhotoAlbum
//             photos={photos}
//             columns={1}
//             targetRowHeight={50}
//             onClick={({ index }) => setIndex(index)}
//             spacing={25}
//           />
//         </div>
//       </div>
//       <Lightbox
//         open={open}
//         close={toggleOpen(false)}
//         index={index}
//         slides={[
//           { src: '/banner/chikawa0.jpg' },
//           { src: '/banner/chikawa1.jpg' },
//           { src: '/banner/chikawa2.jpg' },
//         ]}
//         on={{ view: updateIndex }}
//         animation={{ fade: 0 }}
//         controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
//         plugins={[Thumbnails]}
//       />
//       <VerticalCarousel slides={SLIDES} options={OPTIONS} />
//       <style jsx>{`
//         .wrapper {
//           display: flex;
//         }
//       `}</style>
//     </>
//   )
// }
