import { useQuery } from 'react-query';
import { Map } from 'immutable';
import * as Api from '../api';
import { queryConfig } from './utils';
import { CURRENT_MEMBER_KEY } from '../config/keys';

// eslint-disable-next-line import/prefer-default-export
export const useCurrentMember = () =>
  useQuery({
    queryKey: CURRENT_MEMBER_KEY,
    queryFn: () => Api.getCurrentMember().then((data) => Map(data)),
    ...queryConfig,
  });
