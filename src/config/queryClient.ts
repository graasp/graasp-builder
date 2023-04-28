import { configureQueryClient } from '@graasp/query-client';

import { API_HOST, DOMAIN } from './constants';
import notifier from './notifier';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  mutations,
} = configureQueryClient({
  API_HOST,
  notifier,
  // TODO: ENABLE!!!!!!!
  // enableWebsocket: true,
  defaultQueryOptions: {
    keepPreviousData: true,
    refetchOnMount: false,
    // avoid refetching when same data are closely fetched
    staleTime: 1000, // ms
    cacheTime: 1000, // ms
  },
  DOMAIN,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  mutations,
  ReactQueryDevtools,
};
