import { dedupExchange, fetchExchange, ssrExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { cursorPagination } from './pagination';

const isServerSide = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServerSide });

export const urqlClientVisitors = (ssrExchange: any, ctx: any) => {
  return {
    url: `https://abacoarquitectos.com.ar/graphql`, /* 'http://localhost:3000/graphql' */
    fetchOptions: () => {
      return {
        headers: {},
      };
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedProjects: (data) => null,
        },
        resolvers: {
          Query: {
            projectsByCat : cursorPagination(),
          }
        }
      }),
      ssrCache,
      fetchExchange,
    ],
  };
};