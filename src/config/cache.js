import Dexie from 'dexie';
import { transformIdForPath, getParentsIdsFromPath } from '../utils/item';

export const cache = new Dexie('cache');
cache.version(1).stores({
  items: `id,name,creator`,
});

// necessary when developing with autoreload
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

export const saveItems = async (items) => {
  items.forEach((item) => saveItem(item));
};

export const getRootItems = async () =>
  cache.items.filter(({ path }) => !path.includes('.')).toArray();

export const getChildren = async (id) => {
  if (!id) {
    console.error(`should not get children for id ${id}`);
  }
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return (await cache.items.filter(({ path }) => path.match(reg))).toArray();
};

export const getParents = async (id) => {
  if (!id) {
    console.error(`should not get parent for id ${id}`);
  }

  const item = await getItem(id);
  const parents = getParentsIdsFromPath(item.path);
  return cache.items.bulkGet(parents);
};

export default cache;
