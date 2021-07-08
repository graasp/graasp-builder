// eslint-disable-next-line import/prefer-default-export
export const redirect = (url, { openInNewTab = false } = {}) => {
  const options = openInNewTab ? '_blank' : null;
  window.open(url, options);
};
