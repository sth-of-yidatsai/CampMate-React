export default function MyFooter() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="text-muted">
          <i className="bi bi-geo-alt-fill"></i> 台灣 © 2023 NextJS Inc.
          版權所有
        </div>
        <div className="text-muted">
          <span className="pe-2">
            本網站使用之圖片與媒體素材，均遵守相關授權使用規定。來源列表:
          </span>
          <a href="https://unsplash.com/" className="pe-2">
            Unsplash
          </a>
          <a href="https://icons.getbootstrap.com/" className="pe-2">
            Bootstrap Icons
          </a>
          <a href="https://commons.wikimedia.org/" className="pe-2">
            Wikimedia Commons
          </a>
          <a href="https://fonts.google.com/icons" className="pe-2">
            Material Icons
          </a>
        </div>
      </div>
    </footer>
  )
}
