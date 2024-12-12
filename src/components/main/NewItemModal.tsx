import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { DiscriminatedItem, ItemGeolocation, ItemType } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import { CREATE_ITEM_CLOSE_BUTTON_ID } from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';
import { BUILDER } from '../../langs/constants';
import { EtherpadForm } from '../item/form/EtherpadForm';
import AppForm from '../item/form/app/AppForm';
import { DocumentCreateForm } from '../item/form/document/DocumentCreateForm';
import { UploadFileModalContent } from '../item/form/file/UploadFileModalContent';
import { FolderCreateForm } from '../item/form/folder/FolderCreateForm';
import { LinkForm } from '../item/form/link/LinkForm';
import ImportH5P from './ImportH5P';
import ImportZip from './ImportZip';
import ItemTypeTabs from './ItemTypeTabs';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  paddingLeft: 0,
  paddingRight: 0,
}));

type Props = {
  open: boolean;
  handleClose: () => void;
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

const NewItemModal = ({
  open,
  handleClose,
  geolocation,
  previousItemId,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.LOCAL_FILE,
  );

  const { itemId: parentId } = useParams();

  // folders, apps, files, documents, etherpad and links are handled beforehand
  const renderContent = () => {
    switch (selectedItemType) {
      case InternalItemType.ZIP:
        return (
          <>
            <Typography variant="h6" color="primary">
              {translateBuilder(BUILDER.IMPORT_ZIP_TITLE)}
            </Typography>
            <ImportZip />
          </>
        );
      default:
        return null;
    }
  };

  // folders, etherpad and links, deocuments are handled before
  const renderActions = () => {
    switch (selectedItemType) {
      case InternalItemType.ZIP:
        return (
          <Button id={CREATE_ITEM_CLOSE_BUTTON_ID} onClick={handleClose}>
            {translateCommon(COMMON.CLOSE_BUTTON)}
          </Button>
        );
      default:
        return null;
    }
  };

  // temporary solution to wrap content and actions
  const renderContentWithWrapper = () => {
    let content = null;
    switch (selectedItemType) {
      case ItemType.FOLDER: {
        content = (
          <FolderCreateForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.LINK: {
        content = (
          <LinkForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.APP: {
        content = (
          <AppForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.DOCUMENT: {
        content = (
          <DocumentCreateForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.ETHERPAD: {
        content = <EtherpadForm onClose={handleClose} parentId={parentId} />;
        break;
      }
      case ItemType.H5P: {
        content = (
          <ImportH5P onClose={handleClose} previousItemId={previousItemId} />
        );
        break;
      }
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE: {
        content = (
          <UploadFileModalContent
            previousItemId={previousItemId}
            onClose={handleClose}
          />
        );
        break;
      }
      default: {
        content = renderContent();
      }
    }

    return (
      <>
        <StyledDialogContent>
          <Stack direction="column" px={2} width="100%" overflow="hidden">
            {content}
          </Stack>
        </StyledDialogContent>
        <DialogActions>{renderActions()}</DialogActions>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="row">
        <Stack>
          <ItemTypeTabs
            onTypeChange={setSelectedItemType}
            initialValue={selectedItemType}
          />
        </Stack>
        <Stack width="100%">{renderContentWithWrapper()}</Stack>
      </Stack>
    </Dialog>
  );
};

export default NewItemModal;
