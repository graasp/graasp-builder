import { toast } from 'react-toastify';

import { Notifier, routines } from '@graasp/query-client';
import buildI18n, {
  FAILURE_MESSAGES,
  REQUEST_MESSAGES,
} from '@graasp/translations';

import {
  COPY_ITEM_LINK_TO_CLIPBOARD,
  COPY_MEMBER_ID_TO_CLIPBOARD,
} from '../types/clipboard';

// TODO: get from graasp client
type ErrorPayload = {
  failure?: unknown[];
  error?: { message: string };
};

type SuccessPayload = {
  message?: string;
};

type Payload = ErrorPayload & SuccessPayload;

const i18n = buildI18n();

const getErrorMessageFromPayload = (payload: ErrorPayload) =>
  i18n.t(payload?.error?.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR);

const getSuccessMessageFromPayload = (payload: SuccessPayload) =>
  i18n.t(payload?.message ?? 'The operation successfully proceeded');

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
  importH5PRoutine,
  exportItemRoutine,
  postInvitationsRoutine,
  resendInvitationRoutine,
  updatePasswordRoutine,
  shareItemRoutine,
} = routines;

const notifier: Notifier = ({
  type,
  payload,
}: {
  type: string;
  payload?: Payload;
}) => {
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
    case importH5PRoutine.FAILURE:
    case postInvitationsRoutine.FAILURE:
    case resendInvitationRoutine.FAILURE:
    case updatePasswordRoutine.FAILURE:
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
    case importH5PRoutine.SUCCESS:
    case editItemRoutine.SUCCESS:
    case copyItemsRoutine.SUCCESS:
    case moveItemsRoutine.SUCCESS:
    case deleteItemsRoutine.SUCCESS:
    case deleteItemRoutine.SUCCESS:
    case createItemRoutine.SUCCESS:
    case postInvitationsRoutine.SUCCESS:
    case resendInvitationRoutine.SUCCESS:
    case updatePasswordRoutine.SUCCESS:
    case editMemberRoutine.SUCCESS: {
      message = getSuccessMessageFromPayload(payload);
      break;
    }
    case shareItemRoutine.SUCCESS: {
      if (!payload?.failure?.length) {
        message = getSuccessMessageFromPayload(payload);
      }

      // do nothing for multiple failures: the interface handles it
      break;
    }

    // progress messages
    // todo: this might be handled differently
    case uploadFileRoutine.REQUEST: {
      toast.info(i18n.t(REQUEST_MESSAGES.UPLOAD_FILES));
      break;
    }
    case uploadItemThumbnailRoutine.REQUEST: {
      toast.info(i18n.t(REQUEST_MESSAGES.UPLOAD_FILES));
      break;
    }
    case importZipRoutine.REQUEST: {
      toast.info(i18n.t(REQUEST_MESSAGES.IMPORT_ZIP));
      break;
    }
    case importH5PRoutine.REQUEST: {
      toast.info(i18n.t(REQUEST_MESSAGES.IMPORT_H5P));
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
    // TODO: enable if not websockets
    // allow resend invitation
    toast.success(i18n.t(message));
  }
};
export default notifier;
