import React, { Component } from 'react';
import { Map } from 'immutable';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TreeModal from './TreeModal';
import { copyItem, setCopyModalSettings } from '../../actions';

class CopyItemModal extends Component {
  static propTypes = {
    dispatchCopyItem: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Map).isRequired,
    dispatchSetCopyModalSettings: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  shouldComponentUpdate({ settings }) {
    // update only when is open or on close
    const { settings: prevSettings } = this.props;
    const prevItemId = prevSettings.get('itemId');
    const open = settings.get('open');
    return open || (!open && prevItemId);
  }

  onConfirm = (payload) => {
    const { dispatchCopyItem } = this.props;
    dispatchCopyItem(payload);
  };

  onClose = (payload) => {
    const { dispatchSetCopyModalSettings } = this.props;
    dispatchSetCopyModalSettings(payload);
  };

  render() {
    const { settings, t } = this.props;
    return (
      <TreeModal
        onClose={this.onClose}
        settings={settings}
        onConfirm={this.onConfirm}
        title={t('Where do you want to copy this item?')}
      />
    );
  }
}

const mapStateToProps = ({ layout }) => ({
  settings: layout.getIn(['copyModal']),
});

const mapDispatchToProps = {
  dispatchCopyItem: copyItem,
  dispatchSetCopyModalSettings: setCopyModalSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyItemModal);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;
