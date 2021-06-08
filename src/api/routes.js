export const ITEMS_ROUTE = 'items';
export const buildItemAppApiAccessTokenRoute = (id) =>
  `${ITEMS_ROUTE}/${id}/app-api-access-token`;
