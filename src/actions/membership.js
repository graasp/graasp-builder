import * as Api from '../api/membership';
import { SHARE_ITEM_ERROR, SHARE_ITEM_SUCCESS } from '../types/membership';

// eslint-disable-next-line import/prefer-default-export
export const shareItemWith = ({ id, email, permission }) => async (
  dispatch,
) => {
  try {
    await Api.shareItemWith({ id, email, permission });
    dispatch({
      type: SHARE_ITEM_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: SHARE_ITEM_ERROR,
      payload: {
        error,
      },
    });
  }
};
