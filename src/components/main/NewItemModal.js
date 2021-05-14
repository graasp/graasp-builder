import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useRouteMatch } from 'react-router';
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
import { buildItemPath } from '../../config/paths';
import { POST_ITEM_MUTATION_KEY } from '../../config/keys';
import DocumentForm from '../item/form/DocumentForm';
import AppForm from '../item/form/AppForm';

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const NewItemModal = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedItemType, setSelectedItemType] = useState(ITEM_TYPES.FOLDER);
  const [newItem, setNewItem] = useState({});
  const { mutate: postItem } = useMutation(POST_ITEM_MUTATION_KEY);
  const match = useRouteMatch(buildItemPath());
  const parentId = match?.params?.itemId;

  useEffect(() => {
    switch (selectedItemType) {
      case ITEM_TYPES.FOLDER:
        setNewItem({ type: ITEM_TYPES.FOLDER });
        break;
      case ITEM_TYPES.LINK:
        setNewItem({ type: ITEM_TYPES.LINK });
        break;
      case ITEM_TYPES.DOCUMENT:
        setNewItem({ type: ITEM_TYPES.DOCUMENT });
        break;
      case ITEM_TYPES.APP:
        setNewItem({ type: ITEM_TYPES.APP });
        break;
      default:
        setNewItem({ type: ITEM_TYPES.FOLDER });
    }
  }, [selectedItemType]);

  const submit = () => {
    if (!isItemValid(newItem)) {
      // todo: notify user
      return false;
    }

    postItem({ parentId, ...newItem });
    return handleClose();
  };

  const renderContent = () => {
    switch (selectedItemType) {
      case ITEM_TYPES.FOLDER:
        return <SpaceForm onChange={setNewItem} item={newItem} />;
      case ITEM_TYPES.FILE:
        return <FileDashboardUploader />;
      case ITEM_TYPES.APP:
        return <AppForm onChange={setNewItem} item={newItem} />;
      case ITEM_TYPES.LINK:
        return <LinkForm onChange={setNewItem} item={newItem} />;
      case ITEM_TYPES.DOCUMENT:
        return <DocumentForm onChange={setNewItem} item={newItem} />;
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (selectedItemType) {
      case ITEM_TYPES.FOLDER:
      case ITEM_TYPES.APP:
      case ITEM_TYPES.LINK:
      case ITEM_TYPES.DOCUMENT:
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
};

NewItemModal.defaultProps = {
  open: false,
};

export default NewItemModal;
