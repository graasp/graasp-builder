import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import SpaceForm from '../item/form/SpaceForm';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../config/enum';
import BaseItemForm from '../item/form/BaseItemForm';
import { EDIT_ITEM_MUTATION_KEY } from '../../config/keys';
import DocumentForm from '../item/form/DocumentForm';

const EditItemModalContext = React.createContext();

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const EditItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [updatedItem, setUpdatedItem] = useState(null);
  const mutation = useMutation(EDIT_ITEM_MUTATION_KEY);

  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    setUpdatedItem(item);
  }, [item, setUpdatedItem]);

  const openModal = (newItem) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
  };

  const submit = () => {
    mutation.mutate(updatedItem);
    onClose();
  };

  const renderForm = () => {
    switch (updatedItem?.type) {
      case ITEM_TYPES.DOCUMENT:
        return <DocumentForm onChange={setUpdatedItem} item={updatedItem} />;
      case ITEM_TYPES.FOLDER:
        return <SpaceForm onChange={setUpdatedItem} item={updatedItem} />;
      case ITEM_TYPES.FILE:
      case ITEM_TYPES.S3_FILE:
      case ITEM_TYPES.LINK:
      case ITEM_TYPES.SHORTCUT:
      case ITEM_TYPES.APP:
        return <BaseItemForm onChange={setUpdatedItem} item={updatedItem} />;
      default:
        return null;
    }
  };

  const renderModal = () => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id={item?.id}>{t('Edit Item')}</DialogTitle>
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

  return (
    <EditItemModalContext.Provider value={{ openModal }}>
      {renderModal()}
      {children}
    </EditItemModalContext.Provider>
  );
};

EditItemModalProvider.propTypes = {
  children: PropTypes.node,
};

EditItemModalProvider.defaultProps = {
  children: null,
};

export { EditItemModalProvider, EditItemModalContext };
