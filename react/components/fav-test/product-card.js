import FavFcon from './fav-icon'

export default function ProductCard({ id, name, price }) {
  return (
    <li>
      <FavFcon id={id} />
      <span>
        {name} / {price}
      </span>
    </li>
  )
}
