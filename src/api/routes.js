export const ITEMS_ROUTE = 'items';
export const GET_OWN_ITEMS_ROUTE = `${ITEMS_ROUTE}/own`;
export const SHARE_ITEM_WITH_ROUTE = `${ITEMS_ROUTE}/shared-with`;
export const buildPostItemRoute = (parentId) => {
  let url = ITEMS_ROUTE;
  if (parentId) {
    url += `?parentId=${parentId}`;
  }
  return url;
};
export const buildDeleteItemRoute = (id) => `${ITEMS_ROUTE}/${id}`;
export const buildDeleteItemsRoute = (ids) =>
  `${ITEMS_ROUTE}?${ids.map((id) => `id=${id}`).join('&')}`;
export const buildGetChildrenRoute = (id) => `${ITEMS_ROUTE}/${id}/children`;
export const buildGetItemRoute = (id) => `${ITEMS_ROUTE}/${id}`;
export const buildMoveItemRoute = (id) => `${ITEMS_ROUTE}/${id}/move`;
export const buildCopyItemRoute = (id) => `${ITEMS_ROUTE}/${id}/copy`;
export const buildEditItemRoute = (id) => `${ITEMS_ROUTE}/${id}`;
export const buildShareItemWithRoute = (id) => `item-memberships?itemId=${id}`;
export const buildGetItemMembershipForItemRoute = (id) =>
  `item-memberships?itemId=${id}`;

export const MEMBERS_ROUTE = `members`;
export const buildGetMemberBy = (email) => `${MEMBERS_ROUTE}?email=${email}`;
export const buildGetMember = (id) => `${MEMBERS_ROUTE}/${id}`;
export const buildUploadFilesRoute = (parentId) =>
  parentId
    ? `${ITEMS_ROUTE}/upload?parentId=${parentId}`
    : `${ITEMS_ROUTE}/upload`;
export const buildDownloadFilesRoute = (id) => `${ITEMS_ROUTE}/${id}/download`;
export const buildS3UploadFileRoute = (parentId) =>
  parentId
    ? `${ITEMS_ROUTE}/s3-upload?parentId=${parentId}`
    : `${ITEMS_ROUTE}/s3-upload`;
export const buildGetS3MetadataRoute = (id) =>
  `${ITEMS_ROUTE}/${id}/s3-metadata`;
export const buildS3FileUrl = (key) =>
  `https://graasp-s3-file-items-staging.s3.eu-central-1.amazonaws.com/${key}`;
