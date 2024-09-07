import React from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import Rating from '@mui/material/Rating'
import { PiClubLight } from 'react-icons/pi'

export default function Rank_chart({ comment }) {
  const handleRankCount = (rank) => {
    let rankCount = [] // 使用 let 來允許重新賦值

    if (comment.length > 0) {
      // 使用 filter 並返回匹配的條件
      rankCount = comment.filter((comm) => comm.rating === rank)
    }

    // 計算百分比
    const rankPercent = (rankCount.length / comment.length) * 100

    // 返回或使用 rankPercent
    return rankPercent // 或者在這裡繼續使用 rankPercent 做其他操作
  }

  const countRank = (rank) => {
    let count = []
    if (comment.length > 0) {
      // 使用 filter 並返回匹配的條件
      count = comment.filter((comm) => comm.rating === rank)
    }

    const rankCount = count.length

    return rankCount
  }

  return (
    <>
      <div className="rankChart-tian">
        <div className="fiveStar">
          <Rating
            name="read-only"
            value={5}
            readOnly
            sx={{ color: '#e49366' }}
            size="small"
          />
          <LinearProgress
            variant="determinate"
            value={handleRankCount(5)}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              border: `1px solid #e49366`,
              backgroundColor: '#e5e4cf',
              '& .MuiLinearProgress-bar': { backgroundColor: '#e49366' },
            }}
          />
          <div className="fiveStarNum p3-tc-tian sub-text-tian">
            {countRank(5)}
          </div>
        </div>
        <div className="fourStar">
          <Rating
            name="read-only"
            value={4}
            readOnly
            sx={{ color: '#e49366' }}
            size="small"
          />
          <LinearProgress
            variant="determinate"
            value={handleRankCount(4)}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              border: `1px solid #e49366`,
              backgroundColor: '#e5e4cf',
              '& .MuiLinearProgress-bar': { backgroundColor: '#e49366' },
            }}
          />
          <div className="fiveStarNum p3-tc-tian sub-text-tian">
            {countRank(4)}
          </div>
        </div>
        <div className="threeStar">
          <Rating
            name="read-only"
            value={3}
            readOnly
            sx={{ color: '#e49366' }}
            size="small"
          />
          <LinearProgress
            variant="determinate"
            value={handleRankCount(3)}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              border: `1px solid #e49366`,
              backgroundColor: '#e5e4cf',
              '& .MuiLinearProgress-bar': { backgroundColor: '#e49366' },
            }}
          />
          <div className="fiveStarNum p3-tc-tian sub-text-tian">
            {countRank(3)}
          </div>
        </div>
        <div className="twoStar">
          <Rating
            name="read-only"
            value={2}
            readOnly
            sx={{ color: '#e49366' }}
            size="small"
          />
          <LinearProgress
            variant="determinate"
            value={handleRankCount(2)}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              border: `1px solid #e49366`,
              backgroundColor: '#e5e4cf',
              '& .MuiLinearProgress-bar': { backgroundColor: '#e49366' },
            }}
          />
          <div className="fiveStarNum p3-tc-tian sub-text-tian">
            {countRank(2)}
          </div>
        </div>
        <div className="oneStar">
          <Rating
            name="read-only"
            value={1}
            readOnly
            sx={{ color: '#e49366' }}
            size="small"
          />
          <LinearProgress
            variant="determinate"
            value={handleRankCount(1)}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              border: `1px solid #e49366`,
              backgroundColor: '#e5e4cf',
              '& .MuiLinearProgress-bar': { backgroundColor: '#e49366' },
            }}
          />
          <div className="fiveStarNum p3-tc-tian sub-text-tian">
            {countRank(1)}
          </div>
        </div>
      </div>
    </>
  )
}
