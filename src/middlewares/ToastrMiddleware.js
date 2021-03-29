import { toastr } from 'react-redux-toastr';
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
  GET_ITEM_ERROR_MESSAGE,
  GET_SHARED_ITEMS_ERROR_MESSAGE,
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
} from '../config/messages';
import {
  COPY_ITEM_ERROR,
  COPY_ITEM_SUCCESS,
  CREATE_ITEM_ERROR,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEMS_ERROR,
  DELETE_ITEMS_SUCCESS,
  DELETE_ITEM_ERROR,
  DELETE_ITEM_SUCCESS,
  EDIT_ITEM_ERROR,
  EDIT_ITEM_SUCCESS,
  GET_CHILDREN_ERROR,
  GET_ITEM_ERROR,
  GET_OWN_ITEMS_ERROR,
  GET_SHARED_ITEMS_ERROR,
  MOVE_ITEM_ERROR,
  MOVE_ITEM_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_ERROR,
  FLAG_UPLOADING_FILE,
  SHARE_ITEM_ERROR,
  SHARE_ITEM_SUCCESS,
  SIGN_OUT_ERROR,
  SIGN_OUT_SUCCESS,
} from '../types';

const ToastrMiddleware = () => (next) => (action) => {
  const result = next(action);
  const { type, payload } = result;

  let message = null;
  switch (type) {
    // error messages
    case GET_OWN_ITEMS_ERROR:
    case GET_CHILDREN_ERROR:
    case GET_SHARED_ITEMS_ERROR: {
      message = GET_SHARED_ITEMS_ERROR_MESSAGE;
      break;
    }
    case GET_ITEM_ERROR: {
      message = GET_ITEM_ERROR_MESSAGE;
      break;
    }
    case CREATE_ITEM_ERROR: {
      message = CREATE_ITEM_ERROR_MESSAGE;
      break;
    }
    case DELETE_ITEMS_ERROR:
    case DELETE_ITEM_ERROR: {
      message = DELETE_ITEMS_ERROR_MESSAGE;
      break;
    }
    case MOVE_ITEM_ERROR: {
      message = MOVE_ITEM_ERROR_MESSAGE;
      break;
    }
    case COPY_ITEM_ERROR: {
      message = COPY_ITEM_ERROR_MESSAGE;
      break;
    }
    case EDIT_ITEM_ERROR: {
      message = EDIT_ITEM_ERROR_MESSAGE;
      break;
    }
    case SHARE_ITEM_ERROR: {
      message = SHARE_ITEM_ERROR_MESSAGE;
      break;
    }
    case UPLOAD_FILE_ERROR: {
      message = UPLOAD_FILES_ERROR_MESSAGE;
      break;
    }
    case SIGN_OUT_ERROR: {
      message = SIGN_OUT_ERROR_MESSAGE;
      break;
    }
    // success messages
    case CREATE_ITEM_SUCCESS: {
      message = CREATE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case DELETE_ITEMS_SUCCESS:
    case DELETE_ITEM_SUCCESS: {
      message = DELETE_ITEMS_SUCCESS_MESSAGE;
      break;
    }
    case MOVE_ITEM_SUCCESS: {
      message = MOVE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case COPY_ITEM_SUCCESS: {
      message = COPY_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case EDIT_ITEM_SUCCESS: {
      message = EDIT_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case SHARE_ITEM_SUCCESS: {
      message = SHARE_ITEM_SUCCESS_MESSAGE;
      break;
    }
    case UPLOAD_FILE_SUCCESS: {
      message = UPLOAD_FILES_SUCCESS_MESSAGE;
      break;
    }
    case SIGN_OUT_SUCCESS: {
      message = SIGN_OUT_SUCCESS_MESSAGE;
      break;
    }

    // progress messages
    // todo: this might be handled differently
    case FLAG_UPLOADING_FILE: {
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

  return result;
};

export default ToastrMiddleware;
