import { API_HOST } from '../config/constants';
import { DEFAULT_GET, DEFAULT_POST } from './utils';

// payload = {email}
export const getOwnItems = async () => {
  const req = await fetch(`${API_HOST}/own`, {
    ...DEFAULT_GET,
  });
  // eslint-disable-next-line no-console
  console.log(req);
};

// payload = {email}
export const createItem = async () => {
  const req = await fetch(`${API_HOST}/items`, {
    ...DEFAULT_POST,
    body: JSON.stringify({ name: 'myitem' }),
  });
  // eslint-disable-next-line no-console
  console.log(await req.json());
};

// we need this function for navigation purposes: when you click on an item, you want to see its 'immediate' children
// eslint-disable-next-line import/prefer-default-export
export const fetchItemImmediateChildren = () => {};
