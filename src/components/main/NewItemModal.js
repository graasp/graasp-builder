import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { createItem } from '../../actions/item';
import SpaceForm from '../item/form/SpaceForm';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  CREATE_ITEM_CLOSE_BUTTON_ID,
} from '../../config/selectors';
import ItemTypeButtons from './ItemTypeButtons';
import { ITEM_TYPES } from '../../config/constants';
import FileDashboardUploader from './FileDashboardUploader';
import LinkForm from '../item/form/LinkForm';
import { isItemValid } from '../../utils/item';

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const NewItemModal = ({ open, handleClose, dispatchCreateItem, parentId }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedItemType, setSelectedItemType] = useState(ITEM_TYPES.SPACE);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    switch (selectedItemType) {
      case ITEM_TYPES.SPACE:
        setNewItem({ type: ITEM_TYPES.SPACE });
        break;
      case ITEM_TYPES.LINK:
        setNewItem({ type: ITEM_TYPES.LINK });
        break;
      default:
        setNewItem({ type: ITEM_TYPES.SPACE });
    }
  }, [selectedItemType]);

  const submit = () => {
    if (!isItemValid(newItem)) {
      // todo: notify user
      return false;
    }

    dispatchCreateItem({
      parentId,
      ...newItem,
    });
    return handleClose();
  };

  const renderContent = () => {
    switch (selectedItemType) {
      case ITEM_TYPES.SPACE:
        return <SpaceForm onChange={setNewItem} item={newItem} />;
      case ITEM_TYPES.FILE:
        return <FileDashboardUploader />;
      case ITEM_TYPES.LINK:
        return <LinkForm onChange={setNewItem} item={newItem} />;
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (selectedItemType) {
      case ITEM_TYPES.SPACE:
      case ITEM_TYPES.LINK:
        return (
          <>
            <Button onClick={handleClose} color="primary">
              {t('Cancel')}
            </Button>
            <Button
              onClick={submit}
              color="primary"
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={!isItemValid(newItem)}
            >
              {t('Add')}
            </Button>
          </>
        );
      case ITEM_TYPES.FILE:
        return (
          <Button
            id={CREATE_ITEM_CLOSE_BUTTON_ID}
            onClick={handleClose}
            color="primary"
          >
            {t('Close')}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Add New Item')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <ItemTypeButtons
          setSelectedItemType={setSelectedItemType}
          selectedItemType={selectedItemType}
        />
        {renderContent()}
      </DialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
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
