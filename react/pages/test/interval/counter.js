import { useEffect, useState } from 'react'
import useInterval from '@/hooks/use-interval'

export default function Counter() {
  const [count, setCount] = useState(0)
  // null | 1000
  const [delay, setDelay] = useState(1000)

  useInterval(() => {
    setCount(count + 1)
  }, delay)

  useEffect(() => {
    if (count > 100) setDelay(null)
  }, [count])

  return (
    <div>
      {count}
      <button onClick={() => setDelay(1000)}>start</button>
      <button onClick={() => setDelay(null)}>stop</button>
    </div>
  )
}
