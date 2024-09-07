import React, { useEffect, useState } from 'react'
import { IoMdTrain } from 'react-icons/io'
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'

// ICON
import { LiaTimesSolid } from 'react-icons/lia'

export default function TrainMarker({ attaction_position, city }) {
  const [infowindowOpen, setInfowindowOpen] = useState(false)
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={attaction_position}
        onClick={() => setInfowindowOpen(!infowindowOpen)}
      >
        <div className="marker">
          <IoMdTrain style={{ fontSize: '20px' }} />
        </div>
      </AdvancedMarker>
      {infowindowOpen && (
        <InfoWindow
          style={{ position: 'relative' }}
          anchor={marker}
          maxWidth={250}
          headerDisabled={true}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div className="title-wrapper">
            <div className="title">{city}火車站</div>
          </div>
        </InfoWindow>
      )}

      <style jsx>
        {`
          .title-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 10px;
            align-items: start;
          }
          .times {
            font-size: 16px;
            margin-left: 5px;
          }
          .times:hover {
            color: var(--hint-color);
          }
          .title {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            color: var(--main-color-dark);
            font-weight: 600;
          }
          .marker {
            background: var(--main-color-bright);
            padding: 5px;
            border-radius: 50%;
            color: var(--hint-color);
            border: 2px solid var(--main-color-dark);
          }
        `}
      </style>
    </>
  )
}
