import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { FC, createContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, ItemType } from '@graasp/sdk';
import { BUILDER, COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { isItemValid } from '../../utils/item';
import CancelButton from '../common/CancelButton';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import FolderForm from '../item/form/FolderForm';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const EditItemModalContext = createContext({
  openModal: (_newItem: Item) => {
    // do nothing
  },
});

const EditItemModalProvider: FC<Props> = ({ children }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { mutate: editItem } = useMutation<any, any, any>(
    MUTATION_KEYS.EDIT_ITEM,
  );

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<Item | null>(null);

  const openModal = (newItem: Item) => {
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
      toast.error(translateBuilder(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
      return;
    }

    setConfirmButtonDisabled(true);
    // add id to changed properties
    editItem({ id: item.id, ...updatedProperties });
    onClose();
  };

  const renderForm = () => {
    switch (item?.type) {
      case ItemType.DOCUMENT:
        return (
          <DocumentForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties}
          />
        );
      case ItemType.FOLDER:
        return (
          <FolderForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties}
          />
        );
      case ItemType.LOCAL_FILE:
      case ItemType.S3_FILE:
      case ItemType.LINK:
      case ItemType.SHORTCUT:
      case ItemType.APP:
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
        {translateBuilder(BUILDER.EDIT_ITEM_MODAL_TITLE)}
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
        <CancelButton onClick={onClose} />
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
          {translateCommon(COMMON.SAVE_BUTTON)}
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

export { EditItemModalProvider, EditItemModalContext };
