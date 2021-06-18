import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { initUrqlClient, withUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import {
  GetProjectsByCatDocument,
  GetSectionDocument,
  useGetProjectsByCatQuery,
  useGetSectionQuery,
} from '../frontend/generated/graphql';
import { urqlClientVisitors } from '../utils/urqlClientVisit';
import Section from '../frontend/components/UI/Section/Section';
import Slider from '../frontend/components/UI/Slider/Slider';
import styles from '../pagesCss/arquitectura.module.css';
import { useViewportScroll } from 'framer-motion';

interface arquitecturaProps {}

const arquitectura: NextPage<arquitecturaProps> = ({}) => {
  const [variables, setVariables] = useState<{
    limit: number;
    cursor: string | null;
  }>({ limit: 4, cursor: null });
  const [{ data }] = useGetProjectsByCatQuery({
    variables: { category: 'Arquitectura', ...variables },
  });
  const [{ data: arqData, }] = useGetSectionQuery({
    variables: { id: 'arquitectura' },
  });
  const { scrollY } = useViewportScroll();

  useEffect(() => {
    const LoadOnScroll = () => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollY.get() / height) * 100;
      if (scrolled > 75 && data?.projectsByCat?.hasMore) {
        const projectsLength = data?.projectsByCat?.projects.length - 1;
        setVariables({
          limit: variables.limit,
          cursor: data?.projectsByCat?.projects[projectsLength].year,
        });
      }
    };
    scrollY.onChange(LoadOnScroll);
    return () => {
      scrollY.clearListeners();
    };
  }, [data]);

  return (
    <>
      <Head>
        <title>Arquitectura - Ábaco</title>
      </Head>
      <Section
        className={styles.Header}
        src={`${arqData?.section.img}-w1200.webp`}
        size="md"
        style={{ backgroundPositionY: '30%' }}
      >
        <div>
          <h1>Arquitectura</h1>
        </div>
        <span className={styles.Step}></span>
      </Section>
      <Section className={styles.Section}>
        {data?.projectsByCat.projects
          .map(project => {
            return (
              <div className={styles.Article} key={project.id}>
                <Slider images={project?.images} />
                <div
                  dangerouslySetInnerHTML={{ __html: project.description }}
                ></div>
              </div>
            );
          })}
      </Section>
    </>
  );
};

export async function getStaticProps(ctx: any) {
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

  const data = await client
    ?.query(GetProjectsByCatDocument, { category: 'Arquitectura', limit: 4 })
    .toPromise();
  const arquitectura = await client
    ?.query(GetSectionDocument, { id: 'arquitectura' })
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
})(arquitectura);
