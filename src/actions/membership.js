import * as Api from '../api/membership';

// eslint-disable-next-line import/prefer-default-export
export const shareItemWith = async ({ id, email, permission }) => {
  try {
    await Api.shareItemWith({ id, email, permission });
  } catch (e) {
    console.error(e);
  }
};
