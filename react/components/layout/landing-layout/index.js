import Head from 'next/head'

export default function LandingLayout({ title = '', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <main className="flex-shrink-0 mt-3">
        <div className="container-fluid m-0 p-0">{children}</div>
      </main>
    </>
  )
}
