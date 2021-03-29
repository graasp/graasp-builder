// eslint-disable-next-line import/prefer-default-export
export const updateActivity = (payload) => (activity) => {
  if (payload) {
    return [...activity, payload];
  }
  return activity.slice(1);
};
