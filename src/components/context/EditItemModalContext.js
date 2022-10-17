import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { createContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER, COMMON, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { isItemValid } from '../../utils/item';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import FolderForm from '../item/form/FolderForm';

const EditItemModalContext = createContext();

const EditItemModalProvider = ({ children }) => {
  const { t } = useBuilderTranslation();
  const { t: commonT } = useTranslation(namespaces.common);
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
    // todo: factor out this logic to graasp-ui
    setTimeout(() => setConfirmButtonDisabled(false), DOUBLE_CLICK_DELAY_MS);
  };

  const submit = () => {
    if (isConfirmButtonDisabled) {
      return;
    }
    if (!isItemValid({ ...item, ...updatedProperties })) {
      toast.error(t(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
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
      <DialogTitle id={item?.id}>
        {t(BUILDER.EDIT_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {renderForm()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          {commonT(COMMON.CANCEL_BUTTON)}
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
          {commonT(COMMON.SAVE_BUTTON)}
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
