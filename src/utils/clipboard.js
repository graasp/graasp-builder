// eslint-disable-next-line import/prefer-default-export
export const copyToClipboard = (string, { onSuccess, onError }) => {
  // write to clipboard
  navigator.clipboard
    .writeText(string)
    .then(() => onSuccess?.())
    .catch(() => onError?.());
};
