import React from 'react'

import { useQuery } from '@/hooks/use-query'

import Rating from '@mui/material/Rating'

export default function Rank({}) {
  const { comment } = useQuery()

  return (
    <>
      <div className="rank-tian">
        <div className="score p1-en-tian">
          {comment.length > 0 && comment[0].average_rating}
        </div>
        <Rating
          name="read-only"
          value={Number(comment.length > 0 && comment[0].average_rating)}
          precision={0.1}
          readOnly
          sx={{ color: '#e49366' }}
        />
        <div className="commentNum ">
          <a className="p2-tc-tian sub-text-tian" href="#comment">
            {comment.length > 0 && comment.length}則評論
          </a>
        </div>
      </div>
    </>
  )
}
