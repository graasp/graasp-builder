import Cookies from 'js-cookie';
import { ACCEPT_COOKIES_NAME } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const hasAcceptedCookies = () =>
  Cookies.get(ACCEPT_COOKIES_NAME) === 'true';
