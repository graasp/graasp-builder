// synchronous functions to manage items from redux
import { useEffect, useState } from 'react';

import { Item, ItemMembership, ItemType } from '@graasp/sdk'
import { DEFAULT_IMAGE_SRC, UUID_LENGTH } from '../config/constants';
import { Invitation } from '../config/types'
import {
  getAppExtra,
  getDocumentExtra,
  getEmbeddedLinkExtra,
} from './itemExtra';

// eslint-disable-next-line no-useless-escape
export const transformIdForPath = (id: string): string => id.replace(/\-/g, '_');

export const getParentsIdsFromPath = (path: string, { ignoreSelf = false } = {}): string[] => {
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

export const buildPath = ({ prefix, ids }: { prefix: string, ids: string[] }): string =>
  `${prefix}${ids.map((id) => transformIdForPath(id)).join('.')}`;

export const getItemById = (items: Item[], id: string): Item =>
  items.find(({ id: thisId }) => id === thisId);

export const getDirectParentId = (path: string): string => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const isChild = (id: string): ({ path }: { path: string }) => RegExpMatchArray => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return ({ path }) => path.match(reg);
};

export const getChildren = (items: Item[], id: string): Item[] => items.filter(isChild(id));

export const isRootItem = ({ path }: { path: string }): boolean => path.length === UUID_LENGTH;


export const isUrlValid = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)+' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return str && pattern.test(str);
};

export const isItemValid = (item: Item): boolean => {
  if (!item) {
    return false;
  }

  const { name, type, extra } = item;
  const shouldHaveName = Boolean(name);

  // item should have a type
  let hasValidTypeProperties = Object.values(ItemType).includes(type);
  switch (type) {
    case ItemType.LINK: {
      const { url } = getEmbeddedLinkExtra(extra) || {};
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    case ItemType.APP: {
      const { url } = getAppExtra(extra) || {};
      hasValidTypeProperties = isUrlValid(url);
      break;
    }
    case ItemType.DOCUMENT: {
      const { content } = getDocumentExtra(extra) || {};
      hasValidTypeProperties = content?.length > 0;
      break;
    }
    default:
      break;
  }

  return shouldHaveName && hasValidTypeProperties;
};

export const getItemImage = ({ url, extra, useDefault = true }: { url: string, extra: { thumbnails?: string[] }, useDefault?: boolean }): string | null => {
  if (url) {
    return url;
  }
  const linkThumbnail = getEmbeddedLinkExtra(extra)?.thumbnails?.[0];
  if (linkThumbnail) {
    return linkThumbnail;
  }

  if (useDefault) {
    return DEFAULT_IMAGE_SRC;
  }

  return null;
};

export const getChildrenOrderFromFolderExtra = (item: Item<{ folder: { childrenOrder: string[] } }>): string[] =>
  item?.extra?.folder?.childrenOrder ?? [];

export const stripHtml = (str?: string): string => str?.replace(/<[^>]*>?/gm, '');

// sort objects by alphabetical order according to name
export const sortByName = (a: { name: string }, b: { name: string }): number => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

// todo: use typescript to precise data is one of Invitation or Membership
export const useIsParentInstance = ({ instance, item }: { instance: Invitation | ItemMembership, item: Item }): boolean => {
  const [isParentMembership, setIsParentMembership] = useState(false);
  useEffect(() => {
    setIsParentMembership(instance.itemPath !== item.path);
    return () => {
      setIsParentMembership(false);
    };
  }, [instance, item]);

  return isParentMembership;
};
