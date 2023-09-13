import shortUUID from 'short-uuid';

const { toUUID } = shortUUID();

// eslint-disable-next-line consistent-return, import/prefer-default-export
export const getUUID = (shortenUUID: string = ''): string | undefined => {
  if (shortenUUID) {
    try {
      const uuid = toUUID(shortenUUID);
      return uuid;
    } catch (err) {
      return shortenUUID;
    }
  }
};
