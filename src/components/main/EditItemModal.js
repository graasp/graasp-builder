import React, { useEffect, useState } from 'react';
import { Map, List } from 'immutable';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SpaceForm from '../item/form/SpaceForm';
import { setEditModalSettings, editItem } from '../../actions';
import { getItemById } from '../../utils/item';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../config/constants';
import BaseItemForm from '../item/form/BaseItemForm';

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const EditItemModal = ({
  dispatchEditItem,
  dispatchSetEditModalSettings,
  settings,
  items,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [updatedItem, setUpdatedItem] = useState(null);

  useEffect(() => {
    const selectedId = settings.get('itemId');
    const item = selectedId ? getItemById(items, selectedId) : null;
    setUpdatedItem(item);
  }, [settings, items]);

  const onClose = () => {
    dispatchSetEditModalSettings({ open: false, itemId: null });
  };

  const submit = () => {
    dispatchEditItem(updatedItem);
    onClose();
  };

  const renderForm = () => {
    switch (updatedItem?.type) {
      case ITEM_TYPES.SPACE:
        return <SpaceForm onChange={setUpdatedItem} item={updatedItem} />;
      case ITEM_TYPES.FILE:
      case ITEM_TYPES.S3_FILE:
      case ITEM_TYPES.LINK:
        return <BaseItemForm onChange={setUpdatedItem} item={updatedItem} />;
      default:
        return null;
    }
  };

  const open = settings.get('open');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id={settings.get('itemId')}>{t('Edit Item')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {renderForm()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          onClick={submit}
          color="primary"
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
        >
          {t('Edit Item')}
        </Button>
      </DialogActions>
    </Dialog>
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
