import { DiscriminatedItem } from '@graasp/sdk';

import { validate as uuidValidate, version as uuidVersion } from 'uuid';

// use simple id format for tests
export const ID_FORMAT = '(?=.*[0-9])(?=.*[a-zA-Z])([a-z0-9-]+)';
export const SHORTLINK_FORMAT = '[a-zA-Z0-9-]+';

/**
 * Parse characters of a given string to return a correct regex string
 * This function mainly allows for endpoints to have fixed chain of strings
 * as well as regex descriptions for data validation, eg /items/item-login?parentId=<id>
 *
 * @param {string} string
 * @param {string[]} characters
 * @param {boolean} parseQueryString
 * @returns regex string of the given string
 */
export const parseStringToRegExp = (
  str: string,
  options: { characters?: string[]; parseQueryString?: boolean } = {},
): string => {
  const { characters = ['?', '.'], parseQueryString = false } = options;
  const [originalPathname, ...querystrings] = str.split('?');
  let pathname = originalPathname;
  let querystring = querystrings.join('?');
  characters.forEach((c) => {
    pathname = pathname.replaceAll(c, `\\${c}`);
  });
  if (parseQueryString) {
    characters.forEach((c) => {
      querystring = querystring.replaceAll(c, `\\${c}`);
    });
  }
  return `${pathname}${querystring.length ? '\\?' : ''}${querystring}`;
};

export const EMAIL_FORMAT = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+';

export const uuidValidateV4 = (uuid: string | null | undefined): boolean => {
  if (!uuid) {
    return false;
  }
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

/**
 * Try to extract the item id from a given url.
 * If it fails, an error will be thrown.
 *
 * @param interceptedPathFormat The path's format of the intercepted url.
 * @param url The complete url from the interceptor.
 * @returns The item id if found.
 * @throws If the item is not found.
 */
export const extractItemIdOrThrow = (
  interceptedPathFormat: string,
  url: URL,
): string => {
  const { protocol, host, pathname: urlPath } = url;
  const filterOutEmptyString = (
    value: string,
    _index: number,
    _array: string[],
  ) => value !== '';

  const hostAndProtocol = `${protocol}//${host}`;
  const interceptedParts = `${hostAndProtocol}/${interceptedPathFormat}`
    .slice(hostAndProtocol.length)
    .split('/')
    .filter(filterOutEmptyString);

  const positionOfId = interceptedParts.indexOf(ID_FORMAT);
  const urlParts = urlPath.split('/').filter(filterOutEmptyString);
  const itemId = urlParts[positionOfId];

  if (!uuidValidateV4(itemId)) {
    throw new Error(
      'MockServer error: The item id was not extracted correctly from the url!',
    );
  }

  return itemId;
};

export function getItemById<T extends DiscriminatedItem>(
  items: T[],
  id: string,
): T | undefined {
  return items.find(({ id: thisId }) => id === thisId);
}
