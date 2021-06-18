import { NextPage } from 'next';
import Head from 'next/head';
import { initUrqlClient, NextUrqlPageContext, withUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import {
  GetProjectsByCatDocument,
  GetSectionDocument,
  useGetProjectsByCatQuery,
  useGetSectionQuery,
} from '../../frontend/generated/graphql';
import { urqlClientVisitors } from '../../utils/urqlClientVisit';
import {
  domAnimation,
  m,
  LazyMotion,
  AnimatePresence,
  useViewportScroll,
} from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Section from '../../frontend/components/UI/Section/Section';
import styles from '../../pagesCss/desarrollo.module.css';
import Card from '../../frontend/components/ProjectInterface/Card/Card';
import Link from 'next/link';

const desarrollo: NextPage<{}> = ({}) => {
  const [variables, setVariables] = useState<{
    limit: number;
    cursor: string | null;
  }>({ limit: 12, cursor: null });
  const [{ data: projectsData }] = useGetProjectsByCatQuery({
    variables: { category: 'Construcción', ...variables },
  });
  const [{ data: desData }] = useGetSectionQuery({
    variables: { id: 'construccion' },
  });
  const { scrollY } = useViewportScroll();

  useEffect(() => {
    const LoadOnScroll = () => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollY.get() / height) * 100;
      if (scrolled > 75 && projectsData?.projectsByCat?.hasMore) {
        const projectsLength = projectsData?.projectsByCat?.projects.length - 1;
        setVariables({
          limit: variables.limit,
          cursor: projectsData?.projectsByCat?.projects[projectsLength].year,
        });
      }
    };
    scrollY.onChange(LoadOnScroll);
    return () => {
      scrollY.clearListeners();
    };
  }, [projectsData]);

  return (
    <>
      <Head>
        <title>Construcción - Ábaco</title>
      </Head>
      <LazyMotion features={domAnimation}>
        <m.main
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.2, easings: 'easeInOut' }}
        >
          <Section
            className={styles.Header}
            src={`${desData?.section.img}-w1200.webp`}
            size="md"
            style={{ backgroundPositionY: '30%' }}
          >
            <div>
              <h1>Construcción</h1>
            </div>
            <span className={styles.Step}></span>
          </Section>
          <Section className={styles.CardsLayout}>
            <m.div
              key="container"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.5,
                    staggerChildren: 0.5,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              style={{ width: '100%' }}
            >
              <AnimatePresence initial={false} presenceAffectsLayout>
                {projectsData?.projectsByCat?.projects.map(project => (
                  <Link
                    key={project.id}
                    href={`/construccion/${project.id}`}
                    passHref
                  >
                    <a>
                      <Card project={project} />
                    </a>
                  </Link>
                ))}
              </AnimatePresence>
            </m.div>
          </Section>
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

  await client
    ?.query(GetProjectsByCatDocument, { category: 'Construcción', limit: 12 })
    .toPromise();
  await client?.query(GetSectionDocument, { id: 'construccion' }).toPromise();

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
})(desarrollo);
