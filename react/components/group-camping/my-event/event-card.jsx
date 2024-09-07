import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './event-card.module.scss'

export default function EventCard({ events }) {
  return (
    <div className={styles.cards}>
      {events.map((event) => (
        <div key={event.event_id} className={styles.eventCard}>
          <Image
            className={styles.cardImage}
            src={event.images || '/group-camping/group_camping_01.jpg'}
            alt={event.event_name}
            width={250}
            height={0}
            layout="intrinsic"
            objectFit="cover"
          />
          <div className={styles.cardContent}>
            <div className={`${styles.title} ${styles.h6Tc}`}>
              {event.event_name}
            </div>
            <hr />
            <div className={styles.eventDate}>
              <div className="titleDate p1Tc">團露日期</div>
              <div className={`${styles.date} ${styles.p1En}`}>
                {event.start_date} - {event.end_date}
              </div>
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.tags}>
                {event.attendance_status === 'canceled' ? ( // 已退出則僅顯示"已退出"
                  <div className={`${styles.status} ${styles.canceled}`}>
                    已退出
                  </div>
                ) : (
                  // 正常顯示標籤資訊
                  <>
                    <div className={`${styles.status} ${styles.inProgress}`}>
                      {event.status}
                    </div>
                    {event.isOrganizer && ( // 判斷為團主時顯示
                      <div className={`${styles.status} ${styles.organizer}`}>
                        你是團主
                      </div>
                    )}
                    {event.isParticipant && ( // 判斷為團員時顯示
                      <div className={`${styles.status} ${styles.participant}`}>
                        你是團員
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* <Link href="/group-camping/my-event-detail"> */}
              <Link href={`/group-camping/my-event-detail/${event.event_id}`}>
                <div className={styles.btnMore}>
                  {/* <span className="material-symbols-outlined">visibility</span> */}
                  了解更多
                </div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
