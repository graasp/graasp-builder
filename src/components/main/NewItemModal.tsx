import { Box, styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

import { FC, useState } from 'react';
import { useMatch } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, ItemType } from '@graasp/sdk';
import { BUILDER, COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { useMutation } from '../../config/queryClient';
import {
  CREATE_ITEM_CLOSE_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';
import { isItemValid } from '../../utils/item';
import CancelButton from '../common/CancelButton';
import FileDashboardUploader from '../file/FileDashboardUploader';
import AppForm from '../item/form/AppForm';
import DocumentForm from '../item/form/DocumentForm';
import FolderForm from '../item/form/FolderForm';
import LinkForm from '../item/form/LinkForm';
import ImportH5P from './ImportH5P';
import ImportZip from './ImportZip';
import ItemTypeTabs from './ItemTypeTabs';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  paddingLeft: 0,
}));

type Props = {
  open?: boolean;
  handleClose: () => void;
};

const NewItemModal: FC<Props> = ({ open, handleClose }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.FOLDER,
  );
  const [initialItem] = useState({});
  const [updatedPropertiesPerType, setUpdatedPropertiesPerType] = useState<
    Record<string, Partial<Item>>
  >({
    [ItemType.FOLDER]: { type: ItemType.FOLDER },
    [ItemType.LINK]: { type: ItemType.LINK },
    [ItemType.APP]: { type: ItemType.APP },
    [ItemType.DOCUMENT]: { type: ItemType.DOCUMENT },
  });
  const { mutate: postItem } = useMutation<any, any, any>(
    MUTATION_KEYS.POST_ITEM,
  );
  const match = useMatch(buildItemPath());
  const parentId = match?.params?.itemId;

  const submit = () => {
    if (isConfirmButtonDisabled) {
      console.error('confirm button is disabled');
      return false;
    }
    if (!isItemValid(updatedPropertiesPerType[selectedItemType])) {
      console.error(
        'your item has invalid properties',
        updatedPropertiesPerType[selectedItemType],
      );
      // todo: notify user
      return false;
    }

    setConfirmButtonDisabled(true);
    postItem({ parentId, ...updatedPropertiesPerType[selectedItemType] });

    // schedule button disable state reset AFTER end of click event handling
    setTimeout(() => setConfirmButtonDisabled(false), DOUBLE_CLICK_DELAY_MS);
    return handleClose();
  };

  const updateItem = (item) => {
    // update content given current type
    setUpdatedPropertiesPerType({
      ...updatedPropertiesPerType,
      [selectedItemType]: {
        ...updatedPropertiesPerType[selectedItemType],
        ...item,
      },
    });
  };

  const renderContent = () => {
    switch (selectedItemType) {
      case ItemType.FOLDER:
        return (
          <>
            <Typography variant="h6">
              {translateBuilder(BUILDER.CREATE_ITEM_NEW_FOLDER_TITLE)}
            </Typography>
            <FolderForm
              onChange={updateItem}
              item={initialItem}
              updatedProperties={updatedPropertiesPerType[ItemType.FOLDER]}
            />
          </>
        );
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE:
        return <FileDashboardUploader />;
      case InternalItemType.ZIP:
        return <ImportZip />;
      case ItemType.H5P:
        return <ImportH5P />;
      case ItemType.APP:
        return (
          <AppForm
            onChange={updateItem}
            item={initialItem}
            updatedProperties={updatedPropertiesPerType[ItemType.APP]}
          />
        );
      case ItemType.LINK:
        return <LinkForm onChange={updateItem} item={initialItem} />;
      case ItemType.DOCUMENT:
        return (
          <DocumentForm
            onChange={updateItem}
            item={initialItem}
            updatedProperties={updatedPropertiesPerType[ItemType.DOCUMENT]}
          />
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (selectedItemType) {
      case ItemType.FOLDER:
      case ItemType.APP:
      case ItemType.LINK:
      case ItemType.DOCUMENT:
        return (
          <>
            <CancelButton onClick={handleClose} />
            <Button
              onClick={submit}
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={
                isConfirmButtonDisabled ||
                !isItemValid(updatedPropertiesPerType[selectedItemType])
              }
            >
              {translateBuilder(BUILDER.CREATE_ITEM_ADD_BUTTON)}
            </Button>
          </>
        );
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE:
      case InternalItemType.ZIP:
      case ItemType.H5P:
        return (
          <Button id={CREATE_ITEM_CLOSE_BUTTON_ID} onClick={handleClose}>
            {translateCommon(COMMON.CLOSE_BUTTON)}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogContent>
        <ItemTypeTabs
          onTypeChange={setSelectedItemType}
          initialValue={selectedItemType}
        />
        <Box
          sx={{
            pl: 2,
            pr: 2,
            width: '100%',
          }}
        >
          {renderContent()}
        </Box>
      </StyledDialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default NewItemModal;
