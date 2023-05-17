// synchronous functions to manage items from redux
import { List } from 'immutable';

import { useEffect, useState } from 'react';

import {
  DiscriminatedItem,
  FolderItemExtra,
  Item,
  ItemType,
  getAppExtra,
  getDocumentExtra,
  getEmbeddedLinkExtra,
} from '@graasp/sdk';
import { ImmutableCast, ItemRecord } from '@graasp/sdk/frontend';

import { UUID_LENGTH } from '../config/constants';

export const transformIdForPath = (id: string): string =>
  // eslint-disable-next-line no-useless-escape
  id.replace(/\-/g, '_');

export const getParentsIdsFromPath = (
  path?: string,
  { ignoreSelf = false } = {},
): string[] => {
  if (!path) {
    return [];
  }

  let p = path;
  // ignore self item in path
  if (ignoreSelf) {
    // split path in half parents / self
    // eslint-disable-next-line no-useless-escape
    const els = path.split(/\.[^\.]*$/);
    // if els has only one element, the item has no parent
    if (els.length <= 1) {
      return [];
    }
    [p] = els;
  }
  const ids = p.replace(/_/g, '-').split('.');
  return ids;
};

export const buildPath = ({
  prefix,
  ids,
}: {
  prefix: string;
  ids: string[];
}): string => `${prefix}${ids.map((id) => transformIdForPath(id)).join('.')}`;

export function getItemById<T extends Item>(
  items: T[],
  id: string,
): T | undefined {
  return items.find(({ id: thisId }) => id === thisId);
}

export const getDirectParentId = (path: string): string | null => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const isChild = (
  id: string,
): (({ path }: { path: string }) => RegExpMatchArray | null) => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return ({ path }) => path.match(reg);
};

export const getChildren = (items: Item[], id: string): Item[] =>
  items.filter(isChild(id));

export const isRootItem = ({ path }: { path: string }): boolean =>
  path.length === UUID_LENGTH;

export const isUrlValid = (str?: string): boolean => {
  if (!str) {
    return false;
  }
  const pattern = new RegExp(
    '^(https?:\\/\\/)+' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
};

export const isItemValid = (item: Partial<DiscriminatedItem>): boolean => {
  if (!item) {
    return false;
  }

  const shouldHaveName = Boolean(item.name);

  // item should have a type
  let hasValidTypeProperties =
    item.type && Object.values<string>(ItemType).includes(item.type);
  switch (item.type) {
    case ItemType.LINK: {
      const { url } = getEmbeddedLinkExtra(item.extra) || {};
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    case ItemType.APP: {
      const { url } = getAppExtra(item.extra) || {};
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    case ItemType.DOCUMENT: {
      const { content } = getDocumentExtra(item.extra) || {};
      hasValidTypeProperties = Boolean(content && content.length > 0);
      break;
    }
    default:
      break;
  }

  return shouldHaveName && Boolean(hasValidTypeProperties);
};

export const getChildrenOrderFromFolderExtra = (
  extra: ImmutableCast<FolderItemExtra>,
): List<string> => extra[ItemType.FOLDER]?.childrenOrder ?? List();

export const stripHtml = (str?: string): string =>
  str?.replace(/<[^>]*>?/gm, '') || '';

// sort objects by alphabetical order according to name
export const sortByName = (
  a: { name: string },
  b: { name: string },
): number => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

// todo: use typescript to precise data is one of Invitation or Membership
export function useIsParentInstance({
  instance,
  item,
}: {
  instance: { item: Item };
  item: ItemRecord;
}): boolean {
  const [isParentMembership, setIsParentMembership] = useState(false);
  useEffect(() => {
    setIsParentMembership(instance.item.path !== item.path);
    return () => {
      setIsParentMembership(false);
    };
  }, [instance, item]);

  return isParentMembership;
}
