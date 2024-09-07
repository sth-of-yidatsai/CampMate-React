import React from 'react'

import { useQuery } from '@/hooks/use-query'

import Rating from '@mui/material/Rating'

export default function Comment_card({ comm }) {
  const { users, setUsers } = useQuery()

  let userInfo = []
  if (users.length > 0) {
    userInfo = users.filter((user, i) => {
      return user.id === comm.user_id
    })
  }

  // console.log(`userInfo`)
  // console.log(userInfo)

  return (
    <>
      <div className="commentItem-tian">
        <div className="title">
          <div className="user">
            <div className="userImg">
              <img src={userInfo[0].photo_url} alt="" />
            </div>
            <div className="username">{userInfo[0].account}</div>
          </div>
          <Rating
            name="read-only"
            value={comm.rating}
            readOnly
            sx={{ color: '#e49366' }}
          />
          <div className="commentTime p2-en-tian">{comm.create_datetime}</div>
        </div>
        <div className="content">{comm.comment_content}</div>
      </div>
    </>
  )
}
