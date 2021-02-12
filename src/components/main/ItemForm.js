import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { ITEM_TYPES } from '../../config/constants';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DESCRIPTION_INPUT_ID,
  ITEM_FORM_IMAGE_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_FORM_TYPE_SELECT_ID,
} from '../../config/selectors';
import { areItemsEqual } from '../../utils/item';

const styles = (theme) => ({
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
});

class ItemForm extends Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      shortInputField: PropTypes.string.isRequired,
      dialogContent: PropTypes.string.isRequired,
      addedMargin: PropTypes.string.isRequired,
    }).isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    id: PropTypes.string,
    title: PropTypes.string,
    item: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
      extra: PropTypes.shape({
        image: PropTypes.string,
      }),
    }),
    confirmText: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: '',
    title: null,
    item: {},
  };

  state = {
    itemName: '',
    itemType: ITEM_TYPES.SPACE,
    itemDescription: '',
    itemImageUrl: '',
  };

  componentDidMount() {
    this.setDefaultValues();
  }

  componentDidUpdate({ item: prevItem }) {
    const { item } = this.props;
    if (!areItemsEqual(item, prevItem)) {
      this.setDefaultValues();
    }
  }

  setDefaultValues = () => {
    const { item } = this.props;
    const {
      name: itemName = '',
      type: itemType = ITEM_TYPES.SPACE,
      description: itemDescription = '',
      extra = {},
    } = item || {};
    const { image: itemImageUrl = '' } = extra;
    this.setState({
      itemName,
      itemType,
      itemDescription,
      itemImageUrl,
    });
  };

  handleNameInput = (event) => {
    this.setState({ itemName: event.target.value });
  };

  handleItemSelect = (event) => {
    this.setState({ itemType: event.target.value });
  };

  handleDescriptionInput = (event) => {
    this.setState({ itemDescription: event.target.value });
  };

  handleImageUrlInput = (event) => {
    this.setState({ itemImageUrl: event.target.value });
  };

  onClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  submit = () => {
    const { onConfirm, item } = this.props;
    const { itemName, itemType, itemDescription, itemImageUrl } = this.state;
    onConfirm({
      ...item,
      name: itemName,
      type: itemType,
      description: itemDescription,
      extra: { image: itemImageUrl },
    });
    this.onClose();
  };

  render() {
    const { open, title, classes, t, confirmText, id, item } = this.props;
    const { itemName, itemType, itemDescription, itemImageUrl } = this.state;
    return (
      <Dialog open={open} onClose={this.onClose} maxWidth="sm" fullWidth>
        <DialogTitle id={id}>{title || t('Item Form')}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            autoFocus
            margin="dense"
            id={ITEM_FORM_NAME_INPUT_ID}
            label={t('Name')}
            value={itemName}
            onChange={this.handleNameInput}
            className={classes.shortInputField}
          />
          <InputLabel id="item-type" className={classes.addedMargin}>
            {t('Type')}
          </InputLabel>
          <Select
            id={ITEM_FORM_TYPE_SELECT_ID}
            labelId="item-type-select"
            value={itemType}
            onChange={this.handleItemSelect}
            className={classes.shortInputField}
            defaultValue={itemType}
          >
            {Object.entries(ITEM_TYPES).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {t(value)}
              </MenuItem>
            ))}
          </Select>
          <TextField
            id={ITEM_FORM_DESCRIPTION_INPUT_ID}
            margin="dense"
            label={t('Description')}
            value={itemDescription}
            onChange={this.handleDescriptionInput}
            multiline
            rows={4}
            rowsMax={4}
            fullWidth
          />
          {ITEM_TYPES.FILE !== item?.type && (
            <TextField
              id={ITEM_FORM_IMAGE_INPUT_ID}
              margin="dense"
              label={t('Image (URL)')}
              value={itemImageUrl}
              onChange={this.handleImageUrlInput}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={this.submit}
            color="primary"
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const TranslatedComponent = withTranslation()(ItemForm);
export default withStyles(styles)(TranslatedComponent);
