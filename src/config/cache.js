import Dexie from 'dexie';
import { getParentsIdsFromPath, isChild, isRootItem } from '../utils/item';
import { ROOT_ID } from './constants';

export const cache = new Dexie('cache');
cache.version(1).stores({
  items: `id,name,creator`, // todo: to complete
});

// this line is necessary when developing with autoreload
if (['development', 'test'].includes(process.env.NODE_ENV)) {
  cache.items.clear();
}

export const getItem = (id) => cache.items.get(id);

export const getItems = () => cache.items.toArray();

export const saveItem = async (item) => {
  await cache.transaction('rw', cache.items, () => {
    cache.items
      .get(item.id)
      .then((savedItem) => {
        // update item if
        // - is more recent
        // - current is dirty
        // - children and parents are not defined
        if (
          savedItem.dirty ||
          new Date(savedItem.updatedAt) < new Date(item.updatedAt) ||
          !savedItem.children ||
          !savedItem.parents
        ) {
          cache.items.put(item);
        }
      })
      .catch(() => {
        // add missing item
        cache.items.add(item);
      });
  });
};

export const createItem = async ({ item }) => {
  await cache.transaction('rw', cache.items, () => {
    cache.items.put(item);
  });
};

export const deleteItem = async (id) => {
  await cache.items.delete(id);
};

export const deleteItems = async (ids) => {
  await ids.forEach(deleteItem);
};

export const moveItem = async ({ id, to, from }) => {
  await cache.items.update(id, { dirty: true });
  if (to && to !== ROOT_ID) {
    await cache.items.update(to, { dirty: true });
  }
  if (from && from !== ROOT_ID) {
    await cache.items.update(from, { dirty: true });
  }
};

export const saveItems = async (items) => {
  await items.forEach((item) => saveItem(item));
};

export const getRootItems = () => cache.items.filter(isRootItem).toArray();

export const getChildren = (id) => cache.items.filter(isChild(id)).toArray();

export const getParents = async (id) => {
  const item = await getItem(id);
  const parents = getParentsIdsFromPath(item.path);
  return cache.items.bulkGet(parents);
};

export default cache;
