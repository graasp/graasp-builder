import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { withTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES, UPLOAD_METHOD } from '../../config/constants';
import configureUppy from '../../utils/uppy';
import { setItem, getOwnItems } from '../../actions/item';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';

class FileDashboardUploader extends Component {
  static propTypes = {
    itemId: PropTypes.string,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    dispatchSetItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemId: '',
  };

  state = {
    uppy: null,
  };

  componentDidMount() {
    this.setUppy();
  }

  componentDidUpdate({ itemId: prevItemId }) {
    const { itemId } = this.props;
    if (itemId !== prevItemId) {
      this.setUppy();
    }
  }

  componentWillUnmount() {
    const { uppy } = this.state;
    uppy.close();
  }

  setUppy = () => {
    const { itemId } = this.props;
    this.setState({
      uppy: configureUppy({
        itemId,
        onComplete: this.onComplete,
        onFilesAdded: this.onFilesAdded,
        method: UPLOAD_METHOD,
      }),
    });
  };

  onComplete = (result) => {
    const { itemId, dispatchGetOwnItems, dispatchSetItem } = this.props;

    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      // in the Home component
      if (!itemId) {
        return dispatchGetOwnItems();
      }
      // elsewhere
      return dispatchSetItem(itemId);
    }

    return false;
  };

  render() {
    const { uppy } = this.state;
    const { t } = this.props;

    if (!uppy) {
      return null;
    }

    return (
      <div id={DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          proudlyDisplayPoweredByUppy={false}
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
              dropPaste: `${t('Drop here or')} %{browse}`,
              // Used as the label for the link that opens the system file selection dialog.
              browse: t('Browse'),
            },
          }}
        />
      </div>
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
)(FileDashboardUploader);

export default withTranslation()(ConnectedComponent);
