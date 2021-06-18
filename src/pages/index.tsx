import { NextPage } from 'next';
import { initUrqlClient, NextUrqlPageContext, withUrqlClient } from 'next-urql';
import Head from 'next/head';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import Contact from '../frontend/components/Contact/Contact';
import LastAdded from '../frontend/components/LastAdded/LastAdded';
import Resume from '../frontend/components/Resume/Resume';
import BtnLink from '../frontend/components/UI/BtnLink/BtnLink';
import Logo from '../frontend/components/UI/Logo/Logo';
import Section from '../frontend/components/UI/Section/Section';
import {
  GetLatestProjectsDocument,
  GetSectionDocument,
  useGetSectionQuery,
} from '../frontend/generated/graphql';
import { urqlClientVisitors } from '../utils/urqlClientVisit';
import { m, domAnimation, LazyMotion } from 'framer-motion';
import styles from '../pagesCss/index.module.css';
import { useEffect } from 'react';

const index: NextPage<{}> = ({}) => {
  const [{ data }] = useGetSectionQuery({ variables: { id: 'portada' } });
  
  return (
    <>
      <Head>
        <title>Ábaco</title>
        {data?.section.img && (
          <link
            rel="preload"
            href={`${data?.section.img}-w1200.webp`}
            as="image"
          />
        )}
      </Head>
      <LazyMotion features={domAnimation}>
        <m.main
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.2, easings: 'easeInOut' }}
          className={styles.Body}
        >
          <Section
            src={`${data?.section.img}-w1200.webp`}
            style={{
              height: '91.8vh',
              minHeight: '500px',
              maxHeight: '91.8vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            size="lg"
          >
            <Logo bigLogo />
          </Section>
          <LastAdded />
          <Resume />
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
      url: process.env.PORT
        ? `http://localhost:${process.env.PORT}/graphql`
        : 'http://localhost:3000/graphql',
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const projects = await client?.query(GetLatestProjectsDocument).toPromise();
  const cover = await client
    ?.query(GetSectionDocument, { id: 'portada' })
    .toPromise();
  const arquitectura = await client
    ?.query(GetSectionDocument, { id: 'arquitectura' })
    .toPromise();
  const desarrollo = await client
    ?.query(GetSectionDocument, { id: 'desarrollo' })
    .toPromise();
  const construccion = await client
    ?.query(GetSectionDocument, { id: 'construccion' })
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
})(index);
