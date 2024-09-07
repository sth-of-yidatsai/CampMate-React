import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './event-card.module.scss'

export default function EventCard({ events, isLoading }) {
  return (
    <>
      {isLoading ? (
        <p>Loading...</p> // 資料載入時顯示 Loading
      ) : (
        events.map((event) => {
          return (
            <div
              key={event.event_id}
              className={`${styles.eventCard} ${styles.globe}`}
            >
              <Image
                src={event.images}
                alt="Event Image"
                width={254}
                height={195}
                objectFit="cover"
              />
              <div className={styles.cardContent}>
                <div className={`${styles.title} ${styles.p1Tc}`}>
                  {event.event_name}
                </div>
                <hr />
                <div className={styles.bottom}>
                  <div className={styles.info}>
                    <div className={`${styles.item} ${styles.location}`}>
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      <span className={styles.p2Tc}>{event.ground_city}</span>
                    </div>
                    <div className={`${styles.item} ${styles.date}`}>
                      <span className="material-symbols-outlined">
                        calendar_today
                      </span>
                      <span className={styles.p2En}>
                        from {event.start_date}
                        <br />
                        to {event.end_date}
                      </span>
                    </div>
                    <div className={`${styles.item} ${styles.num}`}>
                      <span className="material-symbols-outlined">person</span>
                      <span className={styles.p2En}>
                        1 / {event.max_member}
                      </span>
                    </div>
                  </div>
                  {/* <Link href="/group-camping/event-detail"> */}
                  <Link href={`/group-camping/event-detail/${event.event_id}`}>
                    <div className={`${styles.btnMore} ${styles.p2Tc}`}>
                      了解更多
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
