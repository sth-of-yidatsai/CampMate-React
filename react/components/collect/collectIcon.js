import { TbHeartMinus } from 'react-icons/tb'
import collectStyles from '@/styles/collect.module.css'

export default function CollectIcon({ id }) {
  return (
    <>
      <TbHeartMinus className={collectStyles.CardIcon2} />
    </>
  )
}
