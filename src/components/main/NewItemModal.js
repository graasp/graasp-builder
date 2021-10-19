import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useRouteMatch } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import FolderForm from '../item/form/FolderForm';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  CREATE_ITEM_CLOSE_BUTTON_ID,
} from '../../config/selectors';
import { useMutation } from '../../config/queryClient';
import { ITEM_TYPES } from '../../enums';
import FileDashboardUploader from './FileDashboardUploader';
import LinkForm from '../item/form/LinkForm';
import { isItemValid } from '../../utils/item';
import { buildItemPath } from '../../config/paths';
import DocumentForm from '../item/form/DocumentForm';
import AppForm from '../item/form/AppForm';
import ItemTypeTabs from './ItemTypeTabs';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    paddingLeft: 0,
  },
  form: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
}));

// time to be considered between 2 clicks for a double-click (https://en.wikipedia.org/wiki/Double-click#Speed_and_timing)
const DOUBLE_CLICK_DELAY_MS = 500;

const NewItemModal = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
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
  const match = useRouteMatch(buildItemPath());
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
            <Typography variant="h6">{t('Create a Folder')}</Typography>
            <FolderForm
              onChange={updateItem}
              item={initialItem}
              updatedProperties={updatedPropertiesPerType[ITEM_TYPES.FOLDER]}
            />
          </>
        );
      case ITEM_TYPES.FILE:
        return <FileDashboardUploader />;
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
            <Button onClick={handleClose} color="primary">
              {t('Cancel')}
            </Button>
            <Button
              onClick={submit}
              color="primary"
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={
                isConfirmButtonDisabled ||
                !isItemValid(updatedPropertiesPerType[selectedItemType])
              }
            >
              {t('Add')}
            </Button>
          </>
        );
      case ITEM_TYPES.FILE:
        return (
          <Button
            id={CREATE_ITEM_CLOSE_BUTTON_ID}
            onClick={handleClose}
            color="primary"
          >
            {t('Close')}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent className={classes.dialogContent}>
        <ItemTypeTabs onTypeChange={setSelectedItemType} />
        <Box className={classes.form}>{renderContent()}</Box>
      </DialogContent>
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
