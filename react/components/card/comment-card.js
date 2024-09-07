import { useState, useEffect } from 'react'
import Rating from '@mui/material/Rating'

export default function CommentCard({ comment }) {
  const [user, setUser] = useState(null)
  const getUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/users-test/comment/${id}`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      if (result.status === 'success') {
        setUser(result.data.user)
      } else {
        throw new Error(result.message || 'Error fetching user data')
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error)
    }
  }

  useEffect(() => {
    getUser(comment.user_id)
  }, [])

  return (
    <>
      <div className="wrapper">
        <div className="userWrapper">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              className="userIcon"
              src={
                user && user.photo_url
                  ? user.photo_url
                  : '/campground/noIcon.webp'
              }
              alt="使用者頭像"
            />
            <span>{user && user.name ? user.name : '來訪者'}</span>
          </div>
          <Rating
            name="read-only"
            value={Number(comment.rating)}
            precision={0.1}
            readOnly
            sx={{
              color: '#e49366',
            }}
          />
        </div>
        <div className="comment">{comment.review_content}</div>
      </div>
      <style jsx>
        {`
          .wrapper {
            margin-top: 5px;
            border: 2px solid var(--hint-color);
            border-radius: 20px;
            background: var(--sub-color);
            height: 142px;
            width: 880px;
            padding-inline: 20px;
            padding-block: 13px;
            display: flex;
            flex-direction: column;
            gap: 11px;
          }
          .userWrapper {
            display: flex;
            gap: 23px;
            align-items: center;
          }
          .userIcon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid #e49366;
            object-fit: cover;
            margin-right: 5px;
          }
          .comment {
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
        `}
      </style>
    </>
  )
}
