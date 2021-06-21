// eslint-disable-next-line import/prefer-default-export
export const copyToClipboard = (string, { onSuccess, onError }) => {
  // check can write to clipboard
  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state === 'granted' || result.state === 'prompt') {
      // write to clipboard
      navigator.clipboard
        .writeText(string)
        .then(() => onSuccess?.())
        .catch(() => onError?.());
    } else {
      onError?.();
    }
  });
};
