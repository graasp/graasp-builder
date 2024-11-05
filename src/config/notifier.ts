import { toast } from 'react-toastify';

import {
  EnableNotifications,
  NotificationStatus,
  Notifier,
  NotifierOptions,
  isNotificationEnabled,
  routines,
} from '@graasp/query-client';
import {
  FAILURE_MESSAGES,
  REQUEST_MESSAGES,
  buildI18n,
} from '@graasp/translations';

import axios from 'axios';

import {
  COPY_ITEM_LINK_TO_CLIPBOARD,
  COPY_MEMBER_ID_TO_CLIPBOARD,
} from '../types/clipboard';

type ErrorPayload = Parameters<Notifier>[0]['payload'] & {
  failure?: unknown[];
};

type SuccessPayload = {
  message?: string;
};

type Payload = ErrorPayload & SuccessPayload;

const i18n = buildI18n();

export const getErrorMessageFromPayload = (
  payload?: Parameters<Notifier>[0]['payload'],
): string => {
  if (payload?.error && axios.isAxiosError(payload.error)) {
    return (
      payload.error.response?.data.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR
    );
  }

  return payload?.error?.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR;
};

const getSuccessMessageFromPayload = (payload?: SuccessPayload) =>
  i18n.t(payload?.message ?? 'The operation successfully proceeded');

const {
  createItemRoutine,
  deleteItemsRoutine,
  deleteItemRoutine,
  moveItemsRoutine,
  copyItemsRoutine,
  editItemRoutine,
  postItemMembershipRoutine,
  uploadFilesRoutine,
  signOutRoutine,
  postItemVisibilityRoutine,
  deleteItemVisibilityRoutine,
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
  createShortLinkRoutine,
  deleteShortLinkRoutine,
  patchShortLinkRoutine,
  patchInvitationRoutine,
  deleteInvitationRoutine,
  deleteItemThumbnailRoutine,
  deleteMembershipRequestRoutine,
} = routines;

const notify = ({
  enableNotifications,
  notificationStatus,
  onEnabled,
  onDisabled,
}: {
  enableNotifications: EnableNotifications | undefined;
  notificationStatus: NotificationStatus;
  onEnabled: () => void;
  onDisabled: () => void;
}) => {
  if (isNotificationEnabled(enableNotifications, notificationStatus)) {
    onEnabled();
  } else {
    onDisabled();
  }
};

const notifyError = (
  message: string,
  enableNotifications: EnableNotifications | undefined,
) => {
  notify({
    enableNotifications,
    notificationStatus: NotificationStatus.ERROR,
    onEnabled: () => toast.error(message),
    onDisabled: () => console.error(message),
  });
};

const notifySuccess = (
  message: string,
  enableNotifications: EnableNotifications | undefined,
) => {
  notify({
    enableNotifications,
    notificationStatus: NotificationStatus.SUCCESS,
    onEnabled: () => toast.success(message),
    // eslint-disable-next-line no-console
    onDisabled: () => console.log(message),
  });
};

const notifyInfo = (
  message: string,
  enableNotifications: EnableNotifications | undefined,
) => {
  notify({
    enableNotifications,
    notificationStatus: NotificationStatus.INFO,
    onEnabled: () => toast.info(message),
    // eslint-disable-next-line no-console
    onDisabled: () => console.log(message),
  });
};

const notifier: Notifier = (
  {
    type,
    payload,
  }: {
    type: string;
    payload?: Payload;
  },
  options?: NotifierOptions,
) => {
  const enableNotifications = options?.enableNotifications;
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
    case uploadFilesRoutine.FAILURE:
    case signOutRoutine.FAILURE:
    case postItemVisibilityRoutine.FAILURE:
    case deleteItemVisibilityRoutine.FAILURE:
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
    case exportItemRoutine.FAILURE:
    case createShortLinkRoutine.FAILURE:
    case deleteShortLinkRoutine.FAILURE:
    case patchShortLinkRoutine.FAILURE:
    case deleteInvitationRoutine.FAILURE:
    case patchInvitationRoutine.FAILURE:
    case deleteItemThumbnailRoutine.FAILURE: {
      message = getErrorMessageFromPayload(payload);
      break;
    }
    // success messages
    case uploadFilesRoutine.SUCCESS:
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
    case editMemberRoutine.SUCCESS:
    case createShortLinkRoutine.SUCCESS:
    case deleteShortLinkRoutine.SUCCESS:
    case patchShortLinkRoutine.SUCCESS:
    case deleteInvitationRoutine.SUCCESS:
    case patchInvitationRoutine.SUCCESS:
    case postItemMembershipRoutine.SUCCESS:
    case deleteMembershipRequestRoutine.SUCCESS:
    case deleteItemThumbnailRoutine.SUCCESS: {
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
    case uploadFilesRoutine.REQUEST:
    case uploadItemThumbnailRoutine.REQUEST: {
      notifyInfo(i18n.t(REQUEST_MESSAGES.UPLOAD_FILES), enableNotifications);
      break;
    }
    case importZipRoutine.REQUEST: {
      notifyInfo(i18n.t(REQUEST_MESSAGES.IMPORT_ZIP), enableNotifications);
      break;
    }
    case importH5PRoutine.REQUEST: {
      notifyInfo(i18n.t(REQUEST_MESSAGES.IMPORT_H5P), enableNotifications);
      break;
    }
    default:
  }
  // error notification
  if (payload?.error) {
    if (message) {
      notifyError(i18n.t(message), enableNotifications);
    } else {
      notifyError(payload.error.toString(), enableNotifications);
    }
  }
  // success notification
  else if (message) {
    // TODO: enable if not websockets
    // allow resend invitation
    notifySuccess(i18n.t(message), enableNotifications);
  }
};

export default notifier;
