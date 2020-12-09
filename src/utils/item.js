export const getParentsIdsFromPath = (path) =>
  path.split('.').map((id) => id.replaceAll('_', '-'));

export const getItemById = (items, id) =>
  items.find(({ id: thisId }) => id === thisId);
