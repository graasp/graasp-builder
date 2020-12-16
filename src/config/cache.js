// eslint-disable-next-line import/prefer-default-export
export const getCachedItem = (getState, id) => {
  const items = getState().item.get('items');
  return items.find(({ id: thisId }) => id === thisId);
};
