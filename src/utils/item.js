// eslint-disable-next-line import/prefer-default-export
export const getParentsIdsFromPath = (path) => {
  return path.split('.').map((id) => id.replaceAll('_', '-'));
};
