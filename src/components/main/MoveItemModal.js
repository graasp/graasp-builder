import React, { Component } from 'react';
import { Map } from 'immutable';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TreeModal from './TreeModal';
import { TREE_PREVENT_SELECTION } from '../../config/constants';
import { setMoveModalSettings, moveItem } from '../../actions';

class MoveItemModal extends Component {
  static propTypes = {
    dispatchMoveItem: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Map).isRequired,
    dispatchSetMoveModalSettings: PropTypes.func.isRequired,
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
    const { dispatchMoveItem } = this.props;
    dispatchMoveItem(payload);
  };

  onClose = (payload) => {
    const { dispatchSetMoveModalSettings } = this.props;
    dispatchSetMoveModalSettings(payload);
  };

  render() {
    const { settings, t } = this.props;

    return (
      <TreeModal
        onClose={this.onClose}
        prevent={TREE_PREVENT_SELECTION.SELF_AND_CHILDREN}
        settings={settings}
        onConfirm={this.onConfirm}
        title={t('Where do you want to move the item?')}
      />
    );
  }
}
const mapStateToProps = ({ layout }) => ({
  settings: layout.getIn(['moveModal']),
});

const mapDispatchToProps = {
  dispatchMoveItem: moveItem,
  dispatchSetMoveModalSettings: setMoveModalSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoveItemModal);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;
