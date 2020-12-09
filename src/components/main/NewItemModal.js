import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createItem } from '../../actions/item';
import ItemForm from './ItemForm';

const NewItemModal = ({ open, handleClose, dispatchCreateItem, parentId }) => {
  const { t } = useTranslation();

  const submitNewItem = async (data) => {
    dispatchCreateItem({
      parentId,
      ...data,
    });
  };

  return (
    <ItemForm
      onConfirm={submitNewItem}
      open={open}
      handleClose={handleClose}
      title={t('Add new Item')}
      confirmText={t('Add Item')}
    />
  );
};

NewItemModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  dispatchCreateItem: PropTypes.func.isRequired,
  parentId: PropTypes.string,
};

NewItemModal.defaultProps = {
  open: false,
  parentId: null,
};

const mapStateToProps = ({ item }) => ({
  parentId: item.getIn(['item', 'id']),
});

const mapDispatchToProps = {
  dispatchCreateItem: createItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewItemModal);

export default ConnectedComponent;
