import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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

const CreateNewItem = ({ open, handleClose }) => {
  const classes = useStyles();
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');

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

  const submitNewItem = () => {};

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
      <DialogTitle id="create-new-item-form">Create new item</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          value={itemName}
          onChange={handleNameInput}
          className={classes.shortInputField}
        />
        <InputLabel id="item-type" className={classes.addedMargin}>
          Type
        </InputLabel>
        <Select
          labelId="item-type-select"
          id="item-type-select"
          value={itemType}
          onChange={handleItemSelect}
          className={classes.shortInputField}
        >
          <MenuItem value="Space">Space</MenuItem>
          <MenuItem value="Application">Application</MenuItem>
          <MenuItem value="Exercise">Exercise</MenuItem>
        </Select>
        <TextField
          margin="dense"
          id="description"
          label="Description"
          value={itemDescription}
          onChange={handleDescriptionInput}
          multiline
          rows={4}
          rowsMax={4}
          fullWidth
        />
        <TextField
          margin="dense"
          id="imageUrl"
          label="Image (URL)"
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
          Cancel
        </Button>
        <Button
          onClick={() => {
            submitNewItem(itemName, itemType, itemDescription, itemImageUrl);
            handleClose();
          }}
          color="primary"
        >
          Add item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateNewItem.propTypes = {
  open: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateNewItem;
