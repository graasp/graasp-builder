// synchronous functions to manage items from redux
import { useEffect, useState } from 'react';

import {
  DiscriminatedItem,
  ItemMembership,
  ItemType,
  getAppExtra,
} from '@graasp/sdk';

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

export const getDirectParentId = (path: string): string | null => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const LINK_REGEX = new RegExp(
  '^(https?:\\/\\/)?' + // protocol is optional
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3})|' + // OR ip (v4) address
    'localhost)' + // OR localhost alias
    '(\\:\\d+)?' + // post (optional)
    '(\\/\\S*?)*' + // path (lazy: takes as few as possible)
    '(\\?\\S*?)?' + // query string (lazy)
    '(\\#\\S*)?$',
  'i',
); // fragment locator

export const isUrlValid = (str?: string | null): boolean => {
  if (!str) {
    return false;
  }
  const pattern = LINK_REGEX;
  if (pattern.test(str)) {
    return true;
  }
  return false;
};

/**
 *
 * @deprecated
 */
export const isItemValid = (item: Partial<DiscriminatedItem>): boolean => {
  if (!item) {
    return false;
  }

  const shouldHaveName = Boolean(item.name?.trim());

  // item should have a type
  let hasValidTypeProperties =
    item.type && Object.values<string>(ItemType).includes(item.type);
  switch (item.type) {
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

// todo: to remove
// get highest permission a member have over an item,
// longer the itemPath, deeper is the permission, thus highest
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
    ({ item: { path: mPath }, account: { id: mId } }) =>
      mId === memberId && itemPath.includes(mPath),
  );
  if (!itemMemberships || itemMemberships.length === 0) {
    return null;
  }

  const sorted = [...itemMemberships];

  // sort memberships by the closest to you first (longest path)
  sorted?.sort((a, b) => (a.item.path.length > b.item.path.length ? -1 : 1));

  return sorted[0];
};
