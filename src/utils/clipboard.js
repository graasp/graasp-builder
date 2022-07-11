// eslint-disable-next-line import/prefer-default-export
export const copyToClipboard = async (string, { onSuccess, onError }) => {
  // write to clipboard
  try {
    await navigator.clipboard.writeText(string);
    onSuccess?.();
  } catch (e) {
    onError?.();
  }
};
