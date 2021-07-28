// eslint-disable-next-line import/prefer-default-export
export const redirect = (url, { openInNewTab = false } = {}) => {
  if (openInNewTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
};
