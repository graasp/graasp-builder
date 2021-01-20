import React from 'react';
import { Map, List } from 'immutable';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editItem } from '../../actions/item';
import ItemForm from './ItemForm';
import { setEditModalSettings } from '../../actions/layout';
import { getItemById } from '../../utils/item';

const EditItemModal = ({
  dispatchEditItem,
  dispatchSetEditModalSettings,
  settings,
  items,
}) => {
  const { t } = useTranslation();

  const submitChanges = async (data) => {
    dispatchEditItem({
      ...data,
    });
  };

  const handleClose = () => {
    dispatchSetEditModalSettings({ open: false, itemId: null });
  };

  const selectedId = settings.get('itemId');
  const item = selectedId ? getItemById(items, selectedId) : null;

  return (
    <ItemForm
      title={t('Edit Item')}
      item={item}
      onConfirm={submitChanges}
      open={settings.get('open')}
      handleClose={handleClose}
      confirmText={t('Edit Item')}
    />
  );
};

EditItemModal.propTypes = {
  dispatchSetEditModalSettings: PropTypes.func.isRequired,
  dispatchEditItem: PropTypes.func.isRequired,
  settings: PropTypes.instanceOf(Map).isRequired,
  items: PropTypes.instanceOf(List).isRequired,
};

const mapStateToProps = ({ item, layout }) => ({
  parentId: item.getIn(['item', 'id']),
  settings: layout.get('editModal'),
  items: item.get('items'),
});

const mapDispatchToProps = {
  dispatchEditItem: editItem,
  dispatchSetEditModalSettings: setEditModalSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditItemModal);

export default ConnectedComponent;
