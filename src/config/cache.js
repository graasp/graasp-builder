import Dexie from 'dexie';

export const cache = new Dexie('cache');
cache.version(1).stores({
  items: `id,name,creator`,
});

// necessary when developing with autoreload
if (['development', 'test'].includes(process.env.NODE_ENV)) {
  cache.items.clear();
}

export const getItem = async (id) => {
  const item = await cache.items.get(id);
  return item?.dirty ? null : item;
};

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

export const createItem = async ({ item, to }) => {
  cache.transaction('rw', cache.items, async () => {
    await cache.items.put(item);
    await cache.items.update(to, { dirty: true });
  });
};

export const deleteItem = async (id) => {
  await cache.items.delete(id);
};

export const saveItems = async (items) => {
  items.forEach((item) => saveItem(item));
};

export const getRootItems = async () => {
  await cache.items.filter(({ path }) => !path.includes('.'));
};

export default cache;
