import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Dialog, DialogTitle } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import { useBuilderTranslation, useMessagesTranslation } from '@/config/i18n';
import { EDIT_MODAL_ID } from '@/config/selectors';

import { BUILDER } from '../../../langs/constants';
import BaseItemForm from '../form/BaseItemForm';
import { DocumentEditForm } from '../form/document/DocumentEditForm';
import FileForm from '../form/file/FileForm';
import { FolderEditForm } from '../form/folder/FolderEditForm';
import EditShortcutForm from '../shortcut/EditShortcutForm';

type Props = {
  item: DiscriminatedItem;
  onClose: () => void;
  open: boolean;
};

const EditModal = ({ item, onClose, open }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateMessage } = useMessagesTranslation();

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedItem, setUpdatedItem] = useState<DiscriminatedItem>(item);

  useEffect(() => {
    if (item.id !== updatedItem.id) {
      setUpdatedItem(item);
    }
  }, [item, updatedItem.id]);

  // temporary solution for displaying separate dialog content
  const renderContent = () => {
    if (item.type === ItemType.FOLDER) {
      return <FolderEditForm onClose={onClose} item={item} />;
    }
    if (item.type === ItemType.LOCAL_FILE || item.type === ItemType.S3_FILE) {
      return <FileForm onClose={onClose} item={item} />;
    }
    if (item.type === ItemType.SHORTCUT) {
      return <EditShortcutForm onClose={onClose} item={item} />;
    }
    if (item.type === ItemType.DOCUMENT) {
      return <DocumentEditForm onClose={onClose} item={item} />;
    }
    if (
      item.type === ItemType.LINK ||
      item.type === ItemType.ETHERPAD ||
      item.type === ItemType.APP ||
      item.type === ItemType.H5P
    ) {
      return <BaseItemForm onClose={onClose} item={item} />;
    }

    toast.error(translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR));

    return null;
  };

  return (
    <Dialog
      onClose={onClose}
      id={EDIT_MODAL_ID}
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={item?.id}>
        {translateBuilder(BUILDER.EDIT_ITEM_MODAL_TITLE)}
      </DialogTitle>
      {renderContent()}
    </Dialog>
  );
};
export default EditModal;
