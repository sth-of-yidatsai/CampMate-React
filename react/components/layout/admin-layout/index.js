import Navbar from './navbar'
import Footer from './footer'
import Sidebar from './sidebar'
import Head from 'next/head'

export default function AdminLayout({ title = '', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <div className="col-lg-12 mx-auto p-2 py-md-2">
        <Navbar />
        <main className="flex-shrink-0 mt-3">
          <div className="container">
            <div className="row g-5">
              <div className="col-md-3 d-none d-sm-block">
                <Sidebar />
              </div>
              <div className="col-md-9">{children}</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
