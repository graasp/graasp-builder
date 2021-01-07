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

export const getItem = async (id) => cache.items.get(id);

export const getItems = async () => cache.items.toArray();

export const saveItem = async (item) => {
  cache.transaction('rw', cache.items, async () => {
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
  cache.transaction('rw', cache.items, async () => {
    await cache.items.put(item);
  });
};

export const deleteItem = async (id) => {
  cache.items.delete(id);
};

export const moveItem = async ({ id, to, from }) => {
  await cache.items.update(id, { dirty: true });
  if (to && to !== ROOT_ID) {
    cache.items.update(to, { dirty: true });
  }
  if (from && from !== ROOT_ID) {
    cache.items.update(from, { dirty: true });
  }
};

export const saveItems = async (items) => {
  items.forEach(async (item) => saveItem(item));
};

export const getRootItems = async () =>
  cache.items.filter(isRootItem).toArray();

export const getChildren = async (id) => {
  if (!id) {
    console.error(`cannot not get children for id ${id}`);
  }
  return (await cache.items.filter(isChild(id))).toArray();
};

export const getParents = async (id) => {
  if (!id) {
    console.error(`cannot get parents for id ${id}`);
  }

  const item = await getItem(id);
  const parents = getParentsIdsFromPath(item.path);
  return cache.items.bulkGet(parents);
};

export default cache;
