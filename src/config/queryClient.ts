import { configureQueryClient } from '@graasp/query-client';

import { API_HOST, DOMAIN } from './env';
import notifier from './notifier';

const {
  queryClient,
  useQueryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  mutations,
  axios,
} = configureQueryClient({
  API_HOST,
  notifier,
  enableWebsocket: true,
  defaultQueryOptions: {
    keepPreviousData: true,
    refetchOnMount: true,
  },
  DOMAIN,
});

export {
  axios,
  queryClient,
  useQueryClient,
  QueryClientProvider,
  hooks,
  mutations,
  ReactQueryDevtools,
};
