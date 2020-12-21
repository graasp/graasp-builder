import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createItem } from '../../actions/item';
import {
  NEW_ITEM_CONFIRM_BUTTON_ID,
  NEW_ITEM_DESCRIPTION_INPUT_ID,
  NEW_ITEM_IMAGE_INPUT_ID,
  NEW_ITEM_NAME_INPUT_ID,
  NEW_ITEM_TYPE_SELECT_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  shortInputField: {
    width: '50%',
  },
  addedMargin: {
    marginTop: theme.spacing(2),
  },
}));

const CreateNewItem = ({ open, handleClose, dispatchCreateItem, parentId }) => {
  const classes = useStyles();
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Space');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const { t } = useTranslation();

  const handleNameInput = (event) => {
    setItemName(event.target.value);
  };

  const handleItemSelect = (event) => {
    setItemType(event.target.value);
  };

  const handleDescriptionInput = (event) => {
    setItemDescription(event.target.value);
  };

  const handleImageUrlInput = (event) => {
    setItemImageUrl(event.target.value);
  };

  const submitNewItem = async () => {
    dispatchCreateItem({
      parentId,
      name: itemName,
      type: itemType,
      description: itemDescription,
      extra: { image: itemImageUrl },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setItemType('');
        handleClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('Create new item')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          autoFocus
          margin="dense"
          id={NEW_ITEM_NAME_INPUT_ID}
          label={t('Name')}
          value={itemName}
          onChange={handleNameInput}
          className={classes.shortInputField}
        />
        <InputLabel id="item-type" className={classes.addedMargin}>
          {t('Type')}
        </InputLabel>
        <Select
          id={NEW_ITEM_TYPE_SELECT_ID}
          value={itemType}
          onChange={handleItemSelect}
          className={classes.shortInputField}
        >
          <MenuItem value="Space">{t('Space')}</MenuItem>
          <MenuItem value="Application">{t('Application')}</MenuItem>
          <MenuItem value="Exercise">{t('Exercise')}</MenuItem>
        </Select>
        <TextField
          margin="dense"
          id={NEW_ITEM_DESCRIPTION_INPUT_ID}
          label={t('Description')}
          value={itemDescription}
          onChange={handleDescriptionInput}
          multiline
          rows={4}
          rowsMax={4}
          fullWidth
        />
        <TextField
          margin="dense"
          id={NEW_ITEM_IMAGE_INPUT_ID}
          label={t('Image (URL)')}
          value={itemImageUrl}
          onChange={handleImageUrlInput}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setItemType('');
            handleClose();
          }}
          color="primary"
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            submitNewItem(itemName, itemType, itemDescription, itemImageUrl);
            handleClose();
          }}
          color="primary"
          id={NEW_ITEM_CONFIRM_BUTTON_ID}
        >
          {t('Add item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateNewItem.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  dispatchCreateItem: PropTypes.func.isRequired,
  parentId: PropTypes.string,
};

CreateNewItem.defaultProps = {
  open: false,
  parentId: null,
};

const mapStateToProps = ({ item }) => ({
  parentId: item.getIn(['item', 'id']),
});

const mapDispatchToProps = {
  dispatchCreateItem: createItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateNewItem);

export default ConnectedComponent;
