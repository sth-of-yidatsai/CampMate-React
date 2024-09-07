import Image from 'next/image'

export default function ProductCardLoading({ item, loading = true }) {
  return (
    <>
      <div className="col">
        <div className="card h-100" aria-hidden="true">
          <Image
            className="card-img-top"
            src={
              loading
                ? '/img-loading.svg'
                : `/images/product/thumb/${item.photos.split(',')[0]}`
            }
            alt="..."
            width={300}
            height={200}
            placeholder="blur"
            blurDataURL={'/img-loading.svg'}
            style={{ width: '100%', height: 'auto' }}
          />

          <div className="card-body">
            {loading ? (
              <h5 className="card-title placeholder-glow">
                <span className="placeholder placeholder-lg col-12"></span>
              </h5>
            ) : (
              <h5 className="card-title limit-text-lines1">{item.name}</h5>
            )}

            {loading ? (
              <p className="card-text placeholder-glow max-lines">
                <span className="placeholder placeholder-lg col-12"></span>
                <span className="placeholder placeholder-lg col-8"></span>
              </p>
            ) : (
              <p className="card-text max-lines">{item.info}</p>
            )}

            {loading ? (
              <a
                href="#/"
                className="btn btn-primary disabled placeholder col-6"
                aria-disabled="true"
              >
                {' '}
              </a>
            ) : (
              <a href="#" className="btn btn-primary">
                了解更多
              </a>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .limit-text-lines1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1; /* 限制要呈現的字行數 */
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .limit-text-lines2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* 限制要呈現的字行數 */
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .limit-text-line3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* 限制要呈現的字行數 */
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .max-lines {
          display: block; /* or inline-block */
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          max-height: 3.6em; /* 限制要呈現的字行數 */
          line-height: 1.8em;
        }
      `}</style>
    </>
  )
}
