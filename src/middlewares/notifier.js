import { toast } from 'react-toastify';
import { routines } from '@graasp/query-client';
import i18n from '../config/i18n';
import {
  COPY_ITEMS_SUCCESS_MESSAGE,
  CREATE_ITEM_SUCCESS_MESSAGE,
  DELETE_ITEMS_SUCCESS_MESSAGE,
  EDIT_ITEM_SUCCESS_MESSAGE,
  MOVE_ITEMS_SUCCESS_MESSAGE,
  SHARE_ITEM_SUCCESS_MESSAGE,
  UPLOAD_FILES_SUCCESS_MESSAGE,
  UPLOAD_FILES_PROGRESS_MESSAGE,
  SIGN_OUT_SUCCESS_MESSAGE,
  EDIT_MEMBER_SUCCESS_MESSAGE,
  COPY_MEMBER_ID_TO_CLIPBOARD_SUCCESS_MESSAGE,
  EDIT_ITEM_MEMBERSHIP_SUCCESS_MESSAGE,
  DELETE_ITEM_MEMBERSHIP_SUCCESS_MESSAGE,
  POST_ITEM_FLAG_SUCCESS_MESSAGE,
  COPY_ITEM_LINK_TO_CLIPBOARD_SUCCESS_MESSAGE,
  RECYCLE_ITEMS_SUCCESS_MESSAGE,
  RESTORE_ITEMS_SUCCESS_MESSAGE,
  UPLOAD_ITEM_THUMBNAIL_SUCCESS_MESSAGE,
  UPLOAD_AVATAR_SUCCESS_MESSAGE,
  IMPORT_ZIP_SUCCESS_MESSAGE,
  IMPORT_ZIP_PROGRESS_MESSAGE,
  EXPORT_ZIP_FAILURE_MESSAGE,
} from '../config/messages';
import {
  COPY_ITEM_LINK_TO_CLIPBOARD,
  COPY_MEMBER_ID_TO_CLIPBOARD,
} from '../types/clipboard';

const {
  createItemRoutine,
  deleteItemsRoutine,
  deleteItemRoutine,
  moveItemsRoutine,
  copyItemsRoutine,
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
  postItemFlagRoutine,
  recycleItemsRoutine,
  restoreItemsRoutine,
  uploadItemThumbnailRoutine,
  uploadAvatarRoutine,
  importZipRoutine,
  downloadItemRoutine,
} = routines;

export default ({ type, payload }) => {
  let message = null;
  switch (type) {
    // error messages
    case editItemMembershipRoutine.FAILURE:
    case deleteItemMembershipRoutine.FAILURE:
    case COPY_MEMBER_ID_TO_CLIPBOARD.FAILURE:
    case editMemberRoutine.FAILURE:
    case createItemRoutine.FAILURE:
    case deleteItemsRoutine.FAILURE:
    case deleteItemRoutine.FAILURE:
    case moveItemsRoutine.FAILURE:
    case copyItemsRoutine.FAILURE:
    case editItemRoutine.FAILURE:
    case shareItemRoutine.FAILURE:
    case uploadFileRoutine.FAILURE:
    case signOutRoutine.FAILURE:
    case postItemTagRoutine.FAILURE:
    case deleteItemTagRoutine.FAILURE:
    case postItemLoginRoutine.FAILURE:
    case postItemFlagRoutine.FAILURE:
    case COPY_ITEM_LINK_TO_CLIPBOARD.FAILURE:
    case recycleItemsRoutine.FAILURE:
    case restoreItemsRoutine.FAILURE:
    case uploadItemThumbnailRoutine.FAILURE:
    case uploadAvatarRoutine.FAILURE:
    case importZipRoutine.FAILURE: {
      // todo: factor out string
      message = i18n.t(
        payload?.error?.response?.data?.message ??
          'An unexpected error occured',
      );
      break;
    }
    case downloadItemRoutine.FAILURE: {
      message = EXPORT_ZIP_FAILURE_MESSAGE;
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
    case moveItemsRoutine.SUCCESS: {
      message = MOVE_ITEMS_SUCCESS_MESSAGE;
      break;
    }
    case copyItemsRoutine.SUCCESS: {
      message = COPY_ITEMS_SUCCESS_MESSAGE;
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
    case postItemFlagRoutine.SUCCESS: {
      message = POST_ITEM_FLAG_SUCCESS_MESSAGE;
      break;
    }
    case COPY_ITEM_LINK_TO_CLIPBOARD.SUCCESS: {
      message = COPY_ITEM_LINK_TO_CLIPBOARD_SUCCESS_MESSAGE;
      break;
    }
    case recycleItemsRoutine.SUCCESS: {
      message = RECYCLE_ITEMS_SUCCESS_MESSAGE;
      break;
    }
    case restoreItemsRoutine.SUCCESS: {
      message = RESTORE_ITEMS_SUCCESS_MESSAGE;
      break;
    }
    case uploadItemThumbnailRoutine.SUCCESS: {
      message = UPLOAD_ITEM_THUMBNAIL_SUCCESS_MESSAGE;
      break;
    }
    case uploadAvatarRoutine.SUCCESS: {
      message = UPLOAD_AVATAR_SUCCESS_MESSAGE;
      break;
    }
    case importZipRoutine.SUCCESS: {
      message = IMPORT_ZIP_SUCCESS_MESSAGE;
      break;
    }

    // progress messages
    // todo: this might be handled differently
    case uploadFileRoutine.REQUEST: {
      toast.info(i18n.t(UPLOAD_FILES_PROGRESS_MESSAGE));
      break;
    }
    case uploadItemThumbnailRoutine.REQUEST: {
      toast.info(i18n.t(UPLOAD_FILES_PROGRESS_MESSAGE));
      break;
    }
    case importZipRoutine.REQUEST: {
      toast.info(i18n.t(IMPORT_ZIP_PROGRESS_MESSAGE));
      break;
    }
    default:
  }
  // error notification
  if (payload?.error && message) {
    toast.error(i18n.t(message));
  }
  // success notification
  else if (message) {
    toast.success(i18n.t(message));
  }
};
