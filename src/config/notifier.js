import { toast } from 'react-toastify';
import { routines } from '@graasp/query-client';
import buildI18n from '@graasp/translations';
import {
  UPLOAD_FILES_PROGRESS_MESSAGE,
  IMPORT_ZIP_PROGRESS_MESSAGE,
} from './messages';
import {
  COPY_ITEM_LINK_TO_CLIPBOARD,
  COPY_MEMBER_ID_TO_CLIPBOARD,
} from '../types/clipboard';

const i18n = buildI18n();

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
    case importZipRoutine.FAILURE:
    case downloadItemRoutine.FAILURE: {
      // todo: factor out string
      message = i18n.t(
        payload?.error?.response?.data?.message ??
          'An unexpected error occured',
      );
      break;
    }
    // success messages
    case shareItemRoutine.SUCCESS:
    case uploadFileRoutine.SUCCESS:
    case signOutRoutine.SUCCESS:
    case COPY_MEMBER_ID_TO_CLIPBOARD.SUCCESS:
    case editItemMembershipRoutine.SUCCESS:
    case deleteItemMembershipRoutine.SUCCESS:
    case postItemFlagRoutine.SUCCESS:
    case COPY_ITEM_LINK_TO_CLIPBOARD.SUCCESS:
    case recycleItemsRoutine.SUCCESS:
    case restoreItemsRoutine.SUCCESS:
    case uploadItemThumbnailRoutine.SUCCESS:
    case uploadAvatarRoutine.SUCCESS:
    case importZipRoutine.SUCCESS:
    case editItemRoutine.SUCCESS:
    case copyItemsRoutine.SUCCESS:
    case moveItemsRoutine.SUCCESS:
    case deleteItemsRoutine.SUCCESS:
    case deleteItemRoutine.SUCCESS:
    case createItemRoutine.SUCCESS:
    case editMemberRoutine.SUCCESS: {
      // todo: factor out string
      message = i18n.t(
        payload?.message ?? 'The operation successfully proceeded',
      );
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
