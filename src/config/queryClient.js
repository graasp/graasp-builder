import configureQueryClient from '@graasp/query-client';
import notifier from '../middlewares/notifier';
import { API_HOST } from './constants';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ws,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
} = configureQueryClient({
  API_HOST,
  notifier,
  enableWebsocket: true,
  keepPreviousData: true,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  ws,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
};
