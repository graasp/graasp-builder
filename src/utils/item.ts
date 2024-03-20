// synchronous functions to manage items from redux
import { useEffect, useState } from 'react';

import {
  DiscriminatedItem,
  FolderItemExtra,
  ItemMembership,
  ItemType,
  getAppExtra,
  getLinkExtra,
} from '@graasp/sdk';

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

export function getItemById<T extends DiscriminatedItem>(
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

export const getChildren = (
  items: DiscriminatedItem[],
  id: string,
): DiscriminatedItem[] => items.filter(isChild(id));

export const isRootItem = ({ path }: { path: string }): boolean =>
  path.length === UUID_LENGTH;

export const isUrlValid = (str?: string | null): boolean => {
  if (!str) {
    return false;
  }
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol is optional
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3})|' + // OR ip (v4) address
      'localhost)' + // OR localhost alias
      '(\\:\\d+)?' + // post (optional)
      '(\\/\\S*?)*' + // path (lazy: takes as few as possible)
      '(\\?\\S*?)?' + // query string (lazy)
      '(\\#\\S*)?$', // fragment locator
    'i',
  );
  return pattern.test(str);
};

export const isItemValid = (item: Partial<DiscriminatedItem>): boolean => {
  if (!item) {
    return false;
  }

  const shouldHaveName = Boolean(item.name?.trim());

  // item should have a type
  let hasValidTypeProperties =
    item.type && Object.values<string>(ItemType).includes(item.type);
  switch (item.type) {
    case ItemType.LINK: {
      let url;
      if (item.extra) {
        ({ url } = getLinkExtra(item.extra) || {});
      }
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    case ItemType.APP: {
      let url;
      if (item.extra) {
        ({ url } = getAppExtra(item.extra) || {});
      }
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    default:
      break;
  }

  return shouldHaveName && Boolean(hasValidTypeProperties);
};

export const getChildrenOrderFromFolderExtra = (
  extra: FolderItemExtra,
): string[] => extra[ItemType.FOLDER]?.childrenOrder ?? [];

export const stripHtml = (str?: string | null): string =>
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
  instance: { item: DiscriminatedItem };
  item: DiscriminatedItem;
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

export const applyEllipsisOnLength = (
  longString: string,
  maxLength: number,
): string =>
  `${longString.slice(0, maxLength)}${
    (longString.length || 0) > maxLength ? '…' : ''
  }`;

// todo: to remove
// get highest permission a member have over an item,
// longer the itemPath, deeper is the permission, thus highested
export const getHighestPermissionForMemberFromMemberships = ({
  memberships,
  memberId,
  itemPath,
}: {
  memberships?: ItemMembership[];
  memberId?: string;
  itemPath: DiscriminatedItem['path'];
}): null | ItemMembership => {
  if (!memberId) {
    return null;
  }

  const itemMemberships = memberships?.filter(
    ({ item: { path: mPath }, member: { id: mId } }) =>
      mId === memberId && itemPath.includes(mPath),
  );
  if (!itemMemberships || itemMemberships.length === 0) {
    return null;
  }

  const sorted = [...itemMemberships];
  sorted?.sort((a, b) => (a.item.path.length > b.item.path.length ? -1 : 1));

  return sorted[0];
};
