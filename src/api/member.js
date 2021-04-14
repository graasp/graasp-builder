import fetch from 'node-fetch';
import { failOnError, DEFAULT_GET } from './utils';
import { API_HOST } from '../config/constants';
import {
  buildGetMemberBy,
  buildGetMember,
  GET_CURRENT_MEMBER_ROUTE,
} from './routes';

export const getMemberBy = async ({ email }) => {
  const res = await fetch(`${API_HOST}/${buildGetMemberBy(email)}`, {
    ...DEFAULT_GET,
  }).then(failOnError);

  return res.json();
};

export const getMember = async ({ id }) => {
  const res = await fetch(`${API_HOST}/${buildGetMember(id)}`, {
    ...DEFAULT_GET,
  }).then(failOnError);

  return res.json();
};

export const getCurrentMember = async () => {
  const res = await fetch(`${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`, {
    ...DEFAULT_GET,
  }).then(failOnError);

  return res.json();
};
