import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { DragDrop } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { withTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import configureUppy from '../../utils/uppy';
import { setItem, getOwnItems } from '../../actions/item';

const styles = (theme) => ({
  wrapper: {
    display: 'none',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    padding: theme.spacing(2),
    left: 0,
    zIndex: theme.zIndex.drawer + 1,

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
    itemId: PropTypes.instanceOf(Map).isRequired,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    dispatchSetItem: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      show: PropTypes.string.isRequired,
      invalid: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    isDragging: false,
    isValid: true,
    uppy: null,
  };

  componentDidMount() {
    const { itemId } = this.props;
    this.setState({
      uppy: configureUppy({
        itemId,
        onComplete: this.onComplete,
      }),
    });
    window.addEventListener('dragenter', this.handleWindowDragEnter);
    window.addEventListener('mouseout', this.handleDragEnd);
  }

  componentDidUpdate({ itemId: prevItemId }) {
    const { itemId } = this.props;
    if (itemId !== prevItemId) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        uppy: configureUppy({ itemId, onComplete: this.onComplete }),
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('dragenter', this.handleWindowDragEnter);
    window.removeEventListener('mouseout', this.handleDragEnd);
  }

  handleWindowDragEnter = () => {
    this.setState({ isDragging: true });
  };

  handleDragEnd = () => {
    const { isDragging } = this.state;
    if (isDragging) {
      this.setState({ isDragging: false });
    }
  };

  onComplete = (result) => {
    const { itemId, dispatchGetOwnItems, dispatchSetItem } = this.props;
    // eslint-disable-next-line no-console
    console.log('successful files:', result.successful);
    // eslint-disable-next-line no-console
    console.log('failed files:', result.failed);

    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result.failed.length) {
      // on Home
      if (!itemId) {
        return dispatchGetOwnItems();
      }
      return dispatchSetItem(itemId);
    }

    return false;
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

    this.setState({ isDragging: false });
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
            note={t('You can upload up to X files at a time', {
              maxFiles: FILE_UPLOAD_MAX_FILES,
            })}
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
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileUploader);
const StyledComponent = withStyles(styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
