import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { DragDrop } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { withTranslation } from 'react-i18next';
import {
  FILE_UPLOAD_MAX_FILES,
  HEADER_HEIGHT,
  UPLOAD_METHOD,
} from '../../config/constants';
import configureUppy from '../../utils/uppy';
import { setItem, getOwnItems } from '../../actions';
import { uploadFileNotification } from '../../actions/file';
import { UPLOADER_ID } from '../../config/selectors';
import {
  FLAG_UPLOADING_FILE,
  UPLOAD_FILE_ERROR,
  UPLOAD_FILE_SUCCESS,
} from '../../types/item';

const styles = (theme) => ({
  wrapper: {
    display: 'none',
    height: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    padding: `${HEADER_HEIGHT + theme.spacing(3)}px ${theme.spacing(
      3,
    )}px ${theme.spacing(3)}px`,
    left: 0,
    // show above drawer
    zIndex: theme.zIndex.drawer + 1,
    opacity: 0.8,

    '& div': {
      width: '100%',
    },
  },
  show: {
    display: 'flex',
  },
  invalid: {
    '& div button': {
      backgroundColor: 'red !important',
    },
  },
});

class FileUploader extends Component {
  static propTypes = {
    itemId: PropTypes.string,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    dispatchSetItem: PropTypes.func.isRequired,
    dispatchUploadFileNotification: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      show: PropTypes.string.isRequired,
      invalid: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemId: '',
  };

  state = {
    isDragging: false,
    isValid: true,
    uppy: null,
  };

  componentDidMount() {
    this.setUppy();

    window.addEventListener('dragenter', this.handleWindowDragEnter);
    window.addEventListener('mouseout', this.handleDragEnd);
  }

  componentDidUpdate({ itemId: prevItemId }) {
    const { itemId } = this.props;
    if (itemId !== prevItemId) {
      this.setUppy();
    }
  }

  componentWillUnmount() {
    const { uppy } = this.state;
    window.removeEventListener('dragenter', this.handleWindowDragEnter);
    window.removeEventListener('mouseout', this.handleDragEnd);

    uppy?.close();
  }

  closeUploader = () => {
    const { isDragging } = this.state;
    if (isDragging) {
      this.setState({ isDragging: false });
    }
  };

  setUppy = () => {
    const { itemId } = this.props;
    this.setState({
      uppy: configureUppy({
        itemId,
        onComplete: this.onComplete,
        onFilesAdded: this.onFilesAdded,
        method: UPLOAD_METHOD,
        onError: this.onError,
        onUpload: this.onUpload,
      }),
    });
  };

  handleWindowDragEnter = () => {
    this.setState({ isDragging: true });
  };

  handleDragEnd = () => {
    this.closeUploader();
  };

  onFilesAdded = () => {
    this.closeUploader();
  };

  onUpload = (payload) => {
    const { dispatchUploadFileNotification } = this.props;
    dispatchUploadFileNotification({
      type: FLAG_UPLOADING_FILE,
      payload,
    });
  };

  onComplete = (result) => {
    const {
      itemId,
      dispatchGetOwnItems,
      dispatchSetItem,
      dispatchUploadFileNotification,
    } = this.props;

    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (result?.successful.length) {
      dispatchUploadFileNotification({
        type: UPLOAD_FILE_SUCCESS,
        payload: result,
      });
      // when uploading at the root: Home
      if (!itemId) {
        return dispatchGetOwnItems();
      }
      return dispatchSetItem(itemId);
    }

    return false;
  };

  onError = (e) => {
    const { dispatchUploadFileNotification } = this.props;
    dispatchUploadFileNotification({
      type: UPLOAD_FILE_ERROR,
      payload: {
        error: JSON.stringify(e),
      },
    });
  };

  handleDragEnter = (event) => {
    // detect whether the dragged files number exceeds limit
    if (event?.dataTransfer?.items) {
      const nbFiles = event.dataTransfer.items.length;

      if (nbFiles > FILE_UPLOAD_MAX_FILES) {
        return this.setState({ isValid: false });
      }
    }

    return this.setState({ isValid: true });
  };

  handleDrop = () => {
    // todo: trigger error that only MAX_FILES was uploaded
    // or cancel drop
    this.closeUploader();
  };

  render() {
    const { isDragging, isValid, uppy } = this.state;
    const { t, classes } = this.props;

    if (!uppy) {
      return null;
    }

    return (
      <>
        <div
          id={UPLOADER_ID}
          className={clsx(classes.wrapper, {
            [classes.show]: isDragging,
            [classes.invalid]: !isValid,
          })}
          onDragEnter={(e) => this.handleDragEnter(e)}
          onDragEnd={(e) => this.handleDragEnd(e)}
          onDragLeave={(e) => this.handleDragEnd(e)}
          onDrop={this.handleDrop}
        >
          <DragDrop
            uppy={uppy}
            note={t(
              `You can upload up to FILE_UPLOAD_MAX_FILES files at a time`,
              {
                maxFiles: FILE_UPLOAD_MAX_FILES,
              },
            )}
            locale={{
              strings: {
                // Text to show on the droppable area.
                // `%{browse}` is replaced with a link that opens the system file selection dialog.
                dropHereOr: `${t('Drop here or')} %{browse}`,
                // Used as the label for the link that opens the system file selection dialog.
                browse: t('Browse'),
              },
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  itemId: item.getIn(['item', 'id']),
});

const mapDispatchToProps = {
  dispatchSetItem: setItem,
  dispatchGetOwnItems: getOwnItems,
  dispatchUploadFileNotification: uploadFileNotification,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileUploader);
const StyledComponent = withStyles(styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
