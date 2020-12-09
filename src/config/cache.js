// eslint-disable-next-line import/prefer-default-export
export const getCachedItem = (items, id) =>
  items.find(({ id: thisId, dirty }) => id === thisId && !dirty);
