import fetch from 'node-fetch';
import { API_HOST } from '../config/constants';
import { checkRequest, DEFAULT_GET } from './utils';
import { buildGetMemberBy, buildGetMember } from './routes';

export const getMemberBy = async ({ email }) => {
  const res = await fetch(`${API_HOST}/${buildGetMemberBy(email)}`, {
    ...DEFAULT_GET,
  }).then(checkRequest);

  return res.json();
};

export const getMember = async ({ id }) => {
  const res = await fetch(`${API_HOST}/${buildGetMember(id)}`, {
    ...DEFAULT_GET,
  }).then(checkRequest);

  return res.json();
};
