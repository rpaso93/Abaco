import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { initUrqlClient, NextUrqlPageContext, withUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import {
  GetProjectDocument,
  GetProjectsByCatDocument,
  Project,
} from '../../frontend/generated/graphql';
import { urqlClientVisitors } from '../../utils/urqlClientVisit';
import ProjectHome from '../../frontend/components/ProjectHome/ProjectHome';
import { useState } from 'react';

const desarrolloID: NextPage<{}> = ({}) => {
  const [filters, setFilters] = useState<String[]>([]);

  return (
    <>
      <ProjectHome
        category="Desarrollo"
        withFilters
        activeFilters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: process.env.PORT ? `http://localhost:${process.env.PORT}/graphql` : 'http://localhost:3000/graphql',
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const data = await client
    ?.query(GetProjectsByCatDocument, { category: 'Desarrollo' })
    .toPromise();

  return {
    paths: (data.data.projectsByCat.projects as Array<Project>).map(project => {
      return { params: { id: (project as any).id } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssrCache = ssrExchange({ isClient: false });

  const client = initUrqlClient(
    {
      url: process.env.PORT ? `http://localhost:${process.env.PORT}/graphql` : 'http://localhost:3000/graphql',
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const data = await client
    ?.query(GetProjectDocument, { id: params.id })
    .toPromise();
  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 60,
  };
};

export default withUrqlClient(urqlClientVisitors, {
  ssr: false,
  neverSuspend: true,
})(desarrolloID);
