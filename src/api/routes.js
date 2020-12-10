export const GET_OWN_ITEMS_ROUTE = `items/own`;
export const SHARE_ITEM_WITH_ROUTE = 'items/shared-with';
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
export const buildEditItemRoute = (id) => `items/${id}`;
export const buildShareItemWithRoute = (id) => `item-memberships?itemId=${id}`;
export const buildGetItemMembershipForItemRoute = (id) =>
  `item-memberships?itemId=${id}`;

export const MEMBERS_ROUTE = `/members`;
export const buildGetMemberBy = (email) => `${MEMBERS_ROUTE}?email=${email}`;
export const buildGetMember = (id) => `${MEMBERS_ROUTE}/${id}`;
