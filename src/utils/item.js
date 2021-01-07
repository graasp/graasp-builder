// synchronous functions to manage items from redux

export const transformIdForPath = (id) => id.replaceAll('-', '_');

export const getParentsIdsFromPath = (path) =>
  path.split('.').map((id) => id.replaceAll('_', '-'));

export const getItemById = (items, id) =>
  items.find(({ id: thisId }) => id === thisId);

export const getDirectParentId = (path) => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const isChild = (id) => ({ path }) => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return path.match(reg);
};

export const getChildren = (items, id) => items.filter(isChild(id));

export const isRootItem = ({ path }) => !path.includes('.');
