import { useQuery } from 'react-query';
import { Map } from 'immutable';
import * as Api from '../api';
import { CURRENT_MEMBER_KEY } from '../config/keys';

// eslint-disable-next-line import/prefer-default-export
export const useCurrentMember = () =>
  useQuery(CURRENT_MEMBER_KEY, () =>
    Api.getCurrentMember().then((data) => Map(data)),
  );
