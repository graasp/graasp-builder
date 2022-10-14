import PropTypes from 'prop-types';

import { Box, styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER, COMMON, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { useMutation } from '../../config/queryClient';
import {
  CREATE_ITEM_CLOSE_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { isItemValid } from '../../utils/item';
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

const NewItemModal = ({ open, handleClose }) => {
  const { t } = useBuilderTranslation();
  const { t: commonT } = useTranslation(namespaces.common);
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState(ITEM_TYPES.FOLDER);
  const [initialItem] = useState({});
  const [updatedPropertiesPerType, setUpdatedPropertiesPerType] = useState({
    [ITEM_TYPES.FOLDER]: { type: ITEM_TYPES.FOLDER },
    [ITEM_TYPES.LINK]: { type: ITEM_TYPES.LINK },
    [ITEM_TYPES.APP]: { type: ITEM_TYPES.APP },
    [ITEM_TYPES.DOCUMENT]: { type: ITEM_TYPES.DOCUMENT },
  });
  const { mutate: postItem } = useMutation(MUTATION_KEYS.POST_ITEM);
  const match = useMatch(buildItemPath());
  const parentId = match?.params?.itemId;

  const submit = () => {
    if (isConfirmButtonDisabled) {
      return false;
    }
    if (!isItemValid(updatedPropertiesPerType[selectedItemType])) {
      // todo: notify user
      return false;
    }

    setConfirmButtonDisabled(true);
    postItem({ parentId, ...updatedPropertiesPerType[selectedItemType] });
    setUpdatedPropertiesPerType({
      ...updatedPropertiesPerType,
      [selectedItemType]: { type: selectedItemType },
    });
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
      case ITEM_TYPES.FOLDER:
        return (
          <>
            <Typography variant="h6">
              {t(BUILDER.CREATE_ITEM_FOLDER_TITLE)}
            </Typography>
            <FolderForm
              onChange={updateItem}
              item={initialItem}
              updatedProperties={updatedPropertiesPerType[ITEM_TYPES.FOLDER]}
            />
          </>
        );
      case ITEM_TYPES.FILE:
        return <FileDashboardUploader />;
      case ITEM_TYPES.ZIP:
        return <ImportZip />;
      case ITEM_TYPES.H5P:
        return <ImportH5P />;
      case ITEM_TYPES.APP:
        return (
          <AppForm
            onChange={updateItem}
            item={initialItem}
            updatedProperties={updatedPropertiesPerType[ITEM_TYPES.APP]}
          />
        );
      case ITEM_TYPES.LINK:
        return (
          <LinkForm
            onChange={updateItem}
            item={initialItem}
            updatedProperties={updatedPropertiesPerType[ITEM_TYPES.LINK]}
          />
        );
      case ITEM_TYPES.DOCUMENT:
        return (
          <DocumentForm
            onChange={updateItem}
            item={initialItem}
            updatedProperties={updatedPropertiesPerType[ITEM_TYPES.DOCUMENT]}
          />
        );
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
            <Button onClick={handleClose} variant="text">
              {commonT(COMMON.CANCEL_BUTTON)}
            </Button>
            <Button
              onClick={submit}
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={
                isConfirmButtonDisabled ||
                !isItemValid(updatedPropertiesPerType[selectedItemType])
              }
            >
              {t(BUILDER.CREATE_ITEM_ADD_BUTTON)}
            </Button>
          </>
        );
      case ITEM_TYPES.FILE:
      case ITEM_TYPES.ZIP:
      case ITEM_TYPES.H5P:
        return (
          <Button id={CREATE_ITEM_CLOSE_BUTTON_ID} onClick={handleClose}>
            {commonT(COMMON.CLOSE_BUTTON)}
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

NewItemModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

NewItemModal.defaultProps = {
  open: false,
};

export default NewItemModal;
