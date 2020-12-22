export const GET_OWN_ITEMS_ROUTE = `items/own`;
export const buildPostItemRoute = (parentId) => {
  let url = `items`;
  if (parentId) {
    url += `?parentId=${parentId}`;
  }
  return url;
};
export const buildDeleteItemRoute = (id) => `items/${id}`;
export const buildGetChildrenRoute = (id) => `items/${id}/children`;
export const buildGetItemRoute = (id) => `items/${id}`;
export const buildMoveItemRoute = (id) => `items/${id}/move`;
export const buildCopyItemRoute = (id) => `items/${id}/copy`;
