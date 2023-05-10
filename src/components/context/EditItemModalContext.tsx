import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { createContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { routines } from '@graasp/query-client';
import {
  DiscriminatedItem,
  DocumentItemType,
  FileItemProperties,
  FolderItemType,
  Item,
  ItemType,
  LocalFileItemType,
  MimeTypes,
  S3FileItemType,
  convertJs,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';
import {
  ItemRecord,
  LocalFileItemTypeRecord,
  S3FileItemTypeRecord,
} from '@graasp/sdk/frontend';
import { BUILDER, COMMON, FAILURE_MESSAGES } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import notifier from '../../config/notifier';
import { mutations } from '../../config/queryClient';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID,
} from '../../config/selectors';
import { isItemValid } from '../../utils/item';
import CancelButton from '../common/CancelButton';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import FolderForm from '../item/form/FolderForm';

const { editItemRoutine } = routines;

type Props = {
  children: JSX.Element | JSX.Element[];
};

const EditItemModalContext = createContext({
  openModal: (_newItem: Item) => {
    // do nothing
  },
});

const EditItemModalProvider = ({ children }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { mutate: editItem } = mutations.useEditItem();

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState<
    Partial<DiscriminatedItem>
  >({});
  // eslint-disable-next-line no-unused-vars
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<ItemRecord | null>(null);

  const openModal = (newItem: Item) => {
    setOpen(true);
    setItem(convertJs(newItem));
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
    setUpdatedItem({});
    // schedule button disable state reset AFTER end of click event handling
    // todo: factor out this logic to graasp-ui
    setTimeout(() => setConfirmButtonDisabled(false), DOUBLE_CLICK_DELAY_MS);
  };

  const submit = () => {
    if (isConfirmButtonDisabled) {
      return;
    }
    if (
      !isItemValid({
        ...(item?.toJS() as Item),
        ...updatedProperties,
      })
    ) {
      toast.error(translateBuilder(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
      return;
    }

    setConfirmButtonDisabled(true);
    // add id to changed properties

    if (!item?.id) {
      notifier({
        type: editItemRoutine.FAILURE,
        payload: { error: new Error(FAILURE_MESSAGES.UNEXPECTED_ERROR) },
      });
    } else {
      editItem({ id: item?.id, ...updatedProperties });
    }

    onClose();
  };

  const renderFileForm = (
    fileItem: LocalFileItemTypeRecord | S3FileItemTypeRecord,
  ) => {
    const localFileExtra =
      fileItem.type === ItemType.LOCAL_FILE
        ? getFileExtra(fileItem.extra)
        : undefined;
    const s3FileExtra =
      fileItem.type === ItemType.S3_FILE
        ? getS3FileExtra(fileItem.extra)
        : undefined;
    const { mimetype, altText } = {
      ...s3FileExtra?.toJS(),
      ...localFileExtra?.toJS(),
    };

    return (
      <>
        <BaseItemForm
          onChange={setUpdatedItem}
          item={fileItem}
          updatedProperties={updatedProperties}
        />
        {mimetype && MimeTypes.isImage(mimetype) && (
          <TextField
            variant="standard"
            id={ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID}
            label="Alternative Text (for accessibility purposes)"
            value={
              (
                updatedProperties?.extra?.[fileItem.type] as
                  | FileItemProperties
                  | undefined
              )?.altText ?? altText
            }
            onChange={(e) =>
              setUpdatedItem({
                ...updatedProperties,
                extra: { [fileItem.type]: { altText: e.target.value } },
              } as LocalFileItemType | S3FileItemType)
            }
            // always shrink because setting name from defined app does not shrink automatically
            InputLabelProps={{ shrink: true }}
            sx={{ width: '50%', my: 1 }}
            multiline
          />
        )}
      </>
    );
  };

  const renderForm = () => {
    switch (item?.type) {
      case ItemType.DOCUMENT:
        return (
          <DocumentForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties as Partial<DocumentItemType>}
          />
        );
      case ItemType.FOLDER:
        return (
          <FolderForm
            onChange={setUpdatedItem}
            item={item}
            updatedProperties={updatedProperties as Partial<FolderItemType>}
          />
        );
      case ItemType.LOCAL_FILE:
      case ItemType.S3_FILE:
        return renderFileForm(item);
      case ItemType.LINK:
      case ItemType.SHORTCUT:
      case ItemType.APP:
        return (
          <BaseItemForm
            onChange={setUpdatedItem}
            item={item}
            // TODO: fix type
            updatedProperties={updatedProperties as any}
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
            !isItemValid({
              ...(item?.toJS() as Item),
              ...updatedProperties,
            })
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
