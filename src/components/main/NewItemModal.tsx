import { useState } from 'react';
import { useMatch } from 'react-router';

import { Box, styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

import {
  AppItemType,
  DocumentItemType,
  EmbeddedLinkItemType,
  FolderItemType,
  Item,
  ItemType,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { mutations } from '../../config/queryClient';
import {
  CREATE_ITEM_CLOSE_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';
import { BUILDER } from '../../langs/constants';
import { isItemValid } from '../../utils/item';
import CancelButton from '../common/CancelButton';
import FileDashboardUploader from '../file/FileDashboardUploader';
import AppForm from '../item/form/AppForm';
import FolderForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import useEtherpadForm from '../item/form/EtherpadForm';
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

type PropertiesPerType = {
  [ItemType.FOLDER]: Partial<FolderItemType>;
  [ItemType.LINK]: Partial<EmbeddedLinkItemType>;
  [ItemType.APP]: Partial<AppItemType>;
  [ItemType.DOCUMENT]: Partial<DocumentItemType>;
};

type Props = {
  open: boolean;
  handleClose: () => void;
};

const DEFAULT_PROPERTIES: PropertiesPerType = {
  [ItemType.FOLDER]: { type: ItemType.FOLDER },
  [ItemType.LINK]: { type: ItemType.LINK },
  [ItemType.APP]: { type: ItemType.APP },
  [ItemType.DOCUMENT]: { type: ItemType.DOCUMENT },
};

const NewItemModal = ({ open, handleClose }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const { padName, EtherpadForm } = useEtherpadForm();

  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.FOLDER,
  );

  // todo: find a way to create this type of literal from the enum values instead of like this...
  const [updatedPropertiesPerType, setUpdatedPropertiesPerType] =
    useState<PropertiesPerType>(DEFAULT_PROPERTIES);

  const { mutate: postItem } = mutations.usePostItem();
  const { mutate: postEtherpad } = mutations.usePostEtherpad();

  const match = useMatch(buildItemPath());
  const parentId = match?.params?.itemId;

  const submitAndDisableConfirmButtonFor = (
    submitFn: () => void | boolean,
    durationMs: number,
  ) => {
    setConfirmButtonDisabled(true);
    submitFn();

    // schedule button disable state reset AFTER end of click event handling
    setTimeout(() => setConfirmButtonDisabled(false), durationMs);
    handleClose();

    setUpdatedPropertiesPerType(DEFAULT_PROPERTIES);
  };

  const submit = () => {
    if (isConfirmButtonDisabled) {
      console.error('confirm button is disabled');
      return false;
    }
    const type = selectedItemType as keyof PropertiesPerType;
    if (!isItemValid(updatedPropertiesPerType[type])) {
      console.error(
        'your item has invalid properties',
        updatedPropertiesPerType[type],
      );
      // todo: notify user
      return false;
    }

    // todo: fix types
    return submitAndDisableConfirmButtonFor(
      () => postItem({ parentId, ...(updatedPropertiesPerType[type] as any) }),
      DOUBLE_CLICK_DELAY_MS,
    );
  };

  const submitEtherpad = () => {
    if (!padName) {
      return false;
    }

    return submitAndDisableConfirmButtonFor(
      () => postEtherpad({ parentId, name: padName }),
      DOUBLE_CLICK_DELAY_MS,
    );
  };

  const updateItem = (item: Partial<Item>) => {
    // update content given current type
    const type = selectedItemType as keyof PropertiesPerType;
    setUpdatedPropertiesPerType({
      ...updatedPropertiesPerType,
      [type]: {
        ...updatedPropertiesPerType[type],
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
              setChanges={updateItem}
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
      case ItemType.ETHERPAD:
        return <EtherpadForm />;
      case ItemType.APP:
        return (
          <AppForm
            onChange={updateItem}
            updatedProperties={updatedPropertiesPerType[ItemType.APP]}
          />
        );
      case ItemType.LINK:
        return <LinkForm onChange={updateItem} />;
      case ItemType.DOCUMENT:
        return (
          <>
            <Typography variant="h6">
              {translateBuilder(BUILDER.CREATE_NEW_ITEM_DOCUMENT_TITLE)}
            </Typography>
            <DocumentForm
              setChanges={updateItem}
              updatedProperties={updatedPropertiesPerType[ItemType.DOCUMENT]}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (selectedItemType) {
      case ItemType.ETHERPAD:
        return (
          <>
            <CancelButton onClick={handleClose} />
            <Button
              onClick={submitEtherpad}
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={!padName}
              type="submit"
            >
              {translateBuilder(BUILDER.CREATE_ITEM_ADD_BUTTON)}
            </Button>
          </>
        );
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
              type="submit"
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
