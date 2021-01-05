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
