import { toastr } from 'react-redux-toastr';
import { routines } from '@graasp/query-client';
import i18n from '../config/i18n';
import {
  COPY_ITEM_ERROR_MESSAGE,
  COPY_ITEM_SUCCESS_MESSAGE,
  CREATE_ITEM_ERROR_MESSAGE,
  CREATE_ITEM_SUCCESS_MESSAGE,
  DELETE_ITEMS_ERROR_MESSAGE,
  DELETE_ITEMS_SUCCESS_MESSAGE,
  EDIT_ITEM_ERROR_MESSAGE,
  EDIT_ITEM_SUCCESS_MESSAGE,
  MOVE_ITEM_ERROR_MESSAGE,
  MOVE_ITEM_SUCCESS_MESSAGE,
  SHARE_ITEM_ERROR_MESSAGE,
  SHARE_ITEM_SUCCESS_MESSAGE,
  UPLOAD_FILES_ERROR_MESSAGE,
  UPLOAD_FILES_SUCCESS_MESSAGE,
  UPLOAD_FILES_PROGRESS_MESSAGE,
  FILE_UPLOAD_INFO_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_MESSAGE_HEADER,
  SIGN_OUT_ERROR_MESSAGE,
  SIGN_OUT_SUCCESS_MESSAGE,
  POST_ITEM_TAG_ERROR_MESSAGE,
  DELETE_ITEM_TAG_ERROR_MESSAGE,
  ITEM_LOGIN_SIGN_IN_ERROR_MESSAGE,
  EDIT_MEMBER_ERROR_MESSAGE,
  EDIT_MEMBER_SUCCESS_MESSAGE,
  COPY_MEMBER_ID_TO_CLIPBOARD_SUCCESS_MESSAGE,
  COPY_MEMBER_ID_TO_CLIPBOARD_ERROR_MESSAGE,
  EDIT_ITEM_MEMBERSHIP_ERROR_MESSAGE,
  DELETE_ITEM_MEMBERSHIP_ERROR_MESSAGE,
  EDIT_ITEM_MEMBERSHIP_SUCCESS_MESSAGE,
  DELETE_ITEM_MEMBERSHIP_SUCCESS_MESSAGE,
} from '../config/messages';
import { COPY_MEMBER_ID_TO_CLIPBOARD } from '../types/clipboard';

const {
  createItemRoutine,
  deleteItemsRoutine,
  deleteItemRoutine,
  moveItemRoutine,
  copyItemRoutine,
  editItemRoutine,
  shareItemRoutine,
  uploadFileRoutine,
  signOutRoutine,
  postItemTagRoutine,
  deleteItemTagRoutine,
  postItemLoginRoutine,
  editMemberRoutine,
  editItemMembershipRoutine,
  deleteItemMembershipRoutine,
} = routines;

export default ({ type, payload }) => {
  let message = null;
  switch (type) {
    // error messages
    case editItemMembershipRoutine.FAILURE: {
      message = EDIT_ITEM_MEMBERSHIP_ERROR_MESSAGE;
      break;
    }
    case deleteItemMembershipRoutine.FAILURE: {
      message = DELETE_ITEM_MEMBERSHIP_ERROR_MESSAGE;
      break;
    }
    case COPY_MEMBER_ID_TO_CLIPBOARD.FAILURE: {
      message = COPY_MEMBER_ID_TO_CLIPBOARD_ERROR_MESSAGE;
      break;
    }
    case editMemberRoutine.FAILURE: {
      message = EDIT_MEMBER_ERROR_MESSAGE;
      break;
    }
    case createItemRoutine.FAILURE: {
      message = CREATE_ITEM_ERROR_MESSAGE;
      break;
    }
    case deleteItemsRoutine.FAILURE:
    case deleteItemRoutine: {
      message = DELETE_ITEMS_ERROR_MESSAGE;
      break;
    }
    case moveItemRoutine.FAILURE: {
      message = MOVE_ITEM_ERROR_MESSAGE;
      break;
    }
    case copyItemRoutine.FAILURE: {
      message = COPY_ITEM_ERROR_MESSAGE;
      break;
    }
    case editItemRoutine.FAILURE: {
      message = EDIT_ITEM_ERROR_MESSAGE;
      break;
    }
    case shareItemRoutine.FAILURE: {
      message = SHARE_ITEM_ERROR_MESSAGE;
      break;
    }
    case uploadFileRoutine.FAILURE: {
      message = UPLOAD_FILES_ERROR_MESSAGE;
      break;
    }
    case signOutRoutine.FAILURE: {
      message = SIGN_OUT_ERROR_MESSAGE;
      break;
    }
    case postItemTagRoutine.FAILURE: {
      message = POST_ITEM_TAG_ERROR_MESSAGE;
      break;
    }
    case deleteItemTagRoutine.FAILURE: {
      message = DELETE_ITEM_TAG_ERROR_MESSAGE;
      break;
    }
    case postItemLoginRoutine.FAILURE: {
      message = ITEM_LOGIN_SIGN_IN_ERROR_MESSAGE;
      break;
    }
    // success messages
    case editMemberRoutine.SUCCESS: {
      message = EDIT_MEMBER_SUCCESS_MESSAGE;
      break;
    }
    case createItemRoutine.SUCCESS: {
      message = CREATE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case deleteItemsRoutine.SUCCESS:
    case deleteItemRoutine.SUCCESS: {
      message = DELETE_ITEMS_SUCCESS_MESSAGE;
      break;
    }
    case moveItemRoutine.SUCCESS: {
      message = MOVE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case copyItemRoutine.SUCCESS: {
      message = COPY_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case editItemRoutine.SUCCESS: {
      message = EDIT_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case shareItemRoutine.SUCCESS: {
      message = SHARE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case uploadFileRoutine.SUCCESS: {
      message = UPLOAD_FILES_SUCCESS_MESSAGE;
      break;
    }
    case signOutRoutine.SUCCESS: {
      message = SIGN_OUT_SUCCESS_MESSAGE;
      break;
    }
    case COPY_MEMBER_ID_TO_CLIPBOARD.SUCCESS: {
      message = COPY_MEMBER_ID_TO_CLIPBOARD_SUCCESS_MESSAGE;
      break;
    }
    case editItemMembershipRoutine.SUCCESS: {
      message = EDIT_ITEM_MEMBERSHIP_SUCCESS_MESSAGE;
      break;
    }
    case deleteItemMembershipRoutine.SUCCESS: {
      message = DELETE_ITEM_MEMBERSHIP_SUCCESS_MESSAGE;
      break;
    }

    // progress messages
    // todo: this might be handled differently
    case uploadFileRoutine.REQUEST: {
      toastr.info(
        i18n.t(FILE_UPLOAD_INFO_MESSAGE_HEADER),
        i18n.t(UPLOAD_FILES_PROGRESS_MESSAGE),
      );
      break;
    }
    default:
  }

  // error notification
  if (payload?.error && message) {
    toastr.error(i18n.t(ERROR_MESSAGE_HEADER), i18n.t(message));
  }
  // success notification
  else if (message) {
    toastr.success(i18n.t(SUCCESS_MESSAGE_HEADER), i18n.t(message));
  }
};
