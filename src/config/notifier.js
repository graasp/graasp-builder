import { toast } from 'react-toastify';
import { routines } from '@graasp/query-client';
import buildI18n, { FAILURE_MESSAGES } from '@graasp/translations';
import {
  UPLOAD_FILES_PROGRESS_MESSAGE,
  IMPORT_ZIP_PROGRESS_MESSAGE,
} from './messages';
import {
  COPY_ITEM_LINK_TO_CLIPBOARD,
  COPY_MEMBER_ID_TO_CLIPBOARD,
} from '../types/clipboard';

const i18n = buildI18n();

const getErrorMessageFromPayload = (payload) =>
  i18n.t(
    payload?.error?.response?.data?.message ??
      FAILURE_MESSAGES.UNEXPECTED_ERROR,
  );

const {
  createItemRoutine,
  deleteItemsRoutine,
  deleteItemRoutine,
  moveItemsRoutine,
  copyItemsRoutine,
  editItemRoutine,
  postItemMembershipRoutine,
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
  exportItemRoutine,
  postInvitationsRoutine,
  resendInvitationRoutine,
  shareItemRoutine,
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
    case postItemMembershipRoutine.FAILURE:
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
    case postInvitationsRoutine.FAILURE:
    case resendInvitationRoutine.FAILURE:
    case shareItemRoutine.FAILURE:
    case exportItemRoutine.FAILURE: {
      message = getErrorMessageFromPayload(payload);
      break;
    }
    // success messages
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
    case postInvitationsRoutine.SUCCESS:
    case resendInvitationRoutine.SUCCESS:
    case editMemberRoutine.SUCCESS: {
      // todo: factor out string
      message = i18n.t(
        payload?.message ?? 'The operation successfully proceeded',
      );
      break;
    }
    case shareItemRoutine.SUCCESS: {
      if (!payload.failure.length) {
        // todo: factor out string
        message = i18n.t(
          payload?.message ?? 'The operation successfully proceeded',
        );
      }

      // do nothing for multiple failures: the interface handles it
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
