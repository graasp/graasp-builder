import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@graasp/ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import FolderForm from '../item/form/FolderForm';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import { isItemValid } from '../../utils/item';

// time to be considered between 2 clicks for a double-click (https://en.wikipedia.org/wiki/Double-click#Speed_and_timing)
const DOUBLE_CLICK_DELAY_MS = 500;

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
  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);

  const openModal = (newItem) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
    setUpdatedItem(null);
    // schedule button disable state reset AFTER end of click event handling
    setTimeout(() => setConfirmButtonDisabled(false), DOUBLE_CLICK_DELAY_MS);
  };

  const submit = () => {
    if (isConfirmButtonDisabled) {
      return;
    }
    if (!isItemValid({ ...item, ...updatedProperties })) {
      // todo: notify user
      return;
    }

    setConfirmButtonDisabled(true);
    // add id to changed properties
    mutation.mutate({ id: item.id, ...updatedProperties });
    onClose();
  };

  const renderForm = () => {
    switch (item?.type) {
      case ITEM_TYPES.DOCUMENT:
        return (
          <DocumentForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties}
          />
        );
      case ITEM_TYPES.FOLDER:
        return (
          <FolderForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties}
          />
        );
      case ITEM_TYPES.FILE:
      case ITEM_TYPES.S3_FILE:
      case ITEM_TYPES.LINK:
      case ITEM_TYPES.SHORTCUT:
      case ITEM_TYPES.APP:
        return (
          <BaseItemForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties}
          />
        );
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
        <Button onClick={onClose} variant="text">
          {t('Cancel')}
        </Button>
        <Button
          // should not allow users to save if the item is not valid
          disabled={
            // maybe we do not need the state variable and can just check the item
            isConfirmButtonDisabled ||
            // isItem Valid checks a full item, so we add the updated properties to the item to check
            !isItemValid({ ...item, ...updatedProperties })
          }
          onClick={submit}
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
        >
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const value = useMemo(() => ({ openModal }), []);

  return (
    <EditItemModalContext.Provider value={value}>
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
