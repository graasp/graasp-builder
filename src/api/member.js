import fetch from 'node-fetch';
import { API_HOST } from '../config/constants';
import { DEFAULT_GET } from './utils';
import { buildGetMemberBy, buildGetMember } from './routes';

export const getMemberBy = async ({ email }) => {
  const res = await fetch(`${API_HOST}/${buildGetMemberBy(email)}`, {
    ...DEFAULT_GET,
  });
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return res.json();
};

export const getMember = async ({ id }) => {
  const res = await fetch(`${API_HOST}/${buildGetMember(id)}`, {
    ...DEFAULT_GET,
  });
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
  return res.json();
};
