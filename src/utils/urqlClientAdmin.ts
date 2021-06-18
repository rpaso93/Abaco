import { dedupExchange, fetchExchange, ssrExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { getToken } from './local';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import {
  DeleteImageMutationVariables,
  DeleteImagesMutationVariables,
  DeleteProjectMutationVariables,
  DeleteProjectsMutationVariables,
  DeleteUserMutationVariables,
  DeleteUsersMutationVariables,
  GetProjectsDocument,
  GetProjectsQuery,
  GetUsersDocument,
  GetUsersQuery,
  LogoutMutation,
} from '../frontend/generated/graphql';

const isServerSide = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServerSide });

export const urqlClientAdmin = (ssrExchange: any, ctx: any) => {
  return {
    url: `https://abacoarquitectos.com.ar/graphql`, /* 'http://localhost:3000/graphql' */
    fetchOptions: () => {
      if (!isServerSide) {
        const token = getToken();
        return {
          headers: { authorization: token ? `Bearer ${token}` : '' },
        };
      }
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            createProject: (_result, args, cache, info) => {
              cache.updateQuery(
                { query: GetProjectsDocument },
                (data: GetProjectsQuery) => {
                  data.projects.push(_result.createProject as any);
                  return data;
                }
              );
            },
            deleteProject: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'Project',
                id: (args as DeleteProjectMutationVariables).id,
              });
            },
            deleteProjects: (_result, args, cache, info) => {
              if (
                typeof (args as DeleteProjectsMutationVariables).ids ===
                'string'
              ) {
                cache.invalidate({
                  __typename: 'Project',
                  id: (args as DeleteProjectMutationVariables).id,
                });
              } else {
                ((args as DeleteProjectsMutationVariables).ids as []).forEach(
                  id =>
                    cache.invalidate({
                      __typename: 'Project',
                      id: id,
                    })
                );
              }
            },
            removeImageFromProject: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'Image',
                id: (args as DeleteImageMutationVariables).id,
              });
            },
            removeImagesFromProject: (_result, args, cache, info) => {
              if (
                typeof (args as DeleteImagesMutationVariables).ids === 'string'
              ) {
                cache.invalidate({
                  __typename: 'Image',
                  id: (args as DeleteImageMutationVariables).id,
                });
              } else {
                ((args as DeleteImagesMutationVariables).ids as []).forEach(
                  id =>
                    cache.invalidate({
                      __typename: 'Image',
                      id: id,
                    })
                );
              }
            },
            register: (_result, args, cache, info) => {
              cache.updateQuery(
                { query: GetUsersDocument },
                (data: GetUsersQuery) => {
                  data.getUsers.push(_result.register as any);
                  return data;
                }
              );
            },
            deleteUser: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'User',
                id: (args as DeleteUserMutationVariables).id,
              });
            },
            deleteUsers: (_result, args, cache, info) => {
              if (
                typeof (args as DeleteUsersMutationVariables).ids === 'string'
              ) {
                cache.invalidate({
                  __typename: 'User',
                  id: (args as DeleteUserMutationVariables).id,
                });
              } else {
                ((args as DeleteUsersMutationVariables).ids as []).forEach(id =>
                  cache.invalidate({
                    __typename: 'User',
                    id: id,
                  })
                );
              }
            },
            logout: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'User',
                id: (_result as LogoutMutation).logout,
              });
            },
          },
        },
      }),
      ssrCache,
      multipartFetchExchange,
    ],
  };
};
