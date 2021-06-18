import { AppProps } from 'next/app';
import Head from 'next/head';
import '../pagesCss/app.css';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';

const DynamicNavbar = dynamic(
  () => import('../frontend/components/UI/Navbar/Navbar')
);

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      {!router.pathname.includes('/admin') && <DynamicNavbar />}
      <AnimatePresence exitBeforeEnter initial={false}>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </>
  );
}

export default MyApp;
