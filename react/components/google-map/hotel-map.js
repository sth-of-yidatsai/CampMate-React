import React, { useState, useRef } from 'react'
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps'
import MarkerWithInfowindow from './marker'

export default function HotelMap({ allCampgoundInfo }) {
  let first_pos, lat, lng
  if (allCampgoundInfo.length > 0) {
    first_pos = allCampgoundInfo[0].geolocation
    lat = Number(first_pos.split(',')[0])
    lng = Number(first_pos.split(',')[1])
  } else {
    lat = 23.46427
    lng = 120.55427
  }

  
  return (
    <>
      <div className="wrapper">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            mapTypeControl={true}
            center={{ lat: lat, lng: lng }}
            defaultZoom={12}
            mapId={'739af084373f96fe'}
            mapTypeId={'roadmap'}
            // gestureHandling={'greedy'}
            disableDefaultUI={true}
            strictBounds={false}
          >
            {allCampgoundInfo.map((camp, i) => {
              return <MarkerWithInfowindow key={i} camp={camp} />
            })}
          </Map>
        </APIProvider>
      </div>
      <style jsx>
        {`
          .wrapper {
            width: 660px;
            height: 100%;
            border-radius: 0 30px 30px 0;
            overflow: hidden;
          }
        `}
      </style>
    </>
  )
}
