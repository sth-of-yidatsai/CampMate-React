import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    window.location.href = 'http://localhost:3000/group-camping/event-list'
  }, [])

  return null
}
