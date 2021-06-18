import { LazyMotion, domAnimation, m } from 'framer-motion';
import { NextPage } from 'next';
import { NextUrqlPageContext, initUrqlClient, withUrqlClient } from 'next-urql';
import Head from 'next/head';
import { useEffect } from 'react';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import Contact from '../frontend/components/Contact/Contact';
import Info from '../frontend/components/Info/Info';
import Map from '../frontend/components/Map/Map';
import Logo from '../frontend/components/UI/Logo/Logo';
import Section from '../frontend/components/UI/Section/Section';
import {
  GetContactDataDocument,
  GetSectionDocument,
  useGetSectionQuery,
} from '../frontend/generated/graphql';
import styles from '../pagesCss/somos.module.css';
import { urqlClientVisitors } from '../utils/urqlClientVisit';

const quiénes_somos: NextPage<{}> = ({}) => {
  const [{ data }] = useGetSectionQuery({ variables: { id: 'quienes_somos' } });
  
  return (
    <>
      <Head>
        <title>Quiénes Somos - Ábaco</title>
        {data?.section.img && (
          <link
            rel="preload"
            href={`${data?.section.img}-w1200.webp`}
            as="image"
          />
        )}
        <link rel='preconnect' href='https://www.google.com/maps/embed/v1/place?key=AIzaSyCs_Gs4WVwRr3t18YZN8Yhb67kkudx-ris&q=Dr.+Tadeo+Acuña+171,+San+Fernando+del+Valle+de+Catamarca,+Catamarca' />
        <link rel="dns-prefetch" href="https://example.com"></link>
      </Head>
      <LazyMotion features={domAnimation}>
        <m.main
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.2, easings: 'easeInOut' }}
        >
          <Section
            className={styles.InfoContainer}
            src={`${data?.section.img}-w1200.webp`}
            size="md"
            style={{ backgroundPositionY: '30%' }}
          >
            <Logo bigLogo />
            <div className={styles.Info}>
              <h1 className={styles.Header}>Quiénes Somos</h1>
              <br />
              <div dangerouslySetInnerHTML={{__html: data?.section.contenido}}>
              </div>
            </div>
            <div className={styles.Step}></div>
          </Section>
          <Info />
          <Map />
          <Contact />
        </m.main>
      </LazyMotion>
    </>
  );
};

export async function getStaticProps(ctx: NextUrqlPageContext) {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: process.env.PORT ? `http://localhost:${process.env.PORT}/graphql` : 'http://localhost:3000/graphql',
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const cover = await client
    ?.query(GetSectionDocument, { id: 'quienes_somos' })
    .toPromise();
  const info = await client
    ?.query(GetContactDataDocument)
    .toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 60,
  };
}

export default withUrqlClient(urqlClientVisitors, {
  ssr: false,
  neverSuspend: true,
})(quiénes_somos);
