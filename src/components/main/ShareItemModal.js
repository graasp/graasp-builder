import React from 'react';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { shareItemWith, setShareModalSettings } from '../../actions';
import {
  DEFAULT_PERMISSION_LEVEL,
  PERMISSION_LEVELS,
} from '../../config/constants';
import {
  buildPermissionOptionId,
  SHARE_ITEM_MODAL_EMAIL_INPUT_ID,
  SHARE_ITEM_MODAL_PERMISSION_SELECT_ID,
  SHARE_ITEM_MODAL_SHARE_BUTTON_ID,
} from '../../config/selectors';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
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
  emailInput: {
    width: '100%',
  },
});

const ShareItemModal = ({
  dispatchSetShareModalSettings,
  settings,
  classes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // refs
  let email = '';
  let permission = '';

  const handleClose = () => {
    dispatchSetShareModalSettings({ open: false, itemId: null });
  };

  const submit = () => {
    // todo: check mail
    const id = settings.get('itemId');
    dispatch(
      shareItemWith({
        id,
        email: email.value,
        permission: permission.value,
      }),
    );

    handleClose();
  };

  const labelId = 'permission-label';
  const renderPermissionSelect = () => (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id={labelId}>{t('Permission')}</InputLabel>
      <Select
        id={SHARE_ITEM_MODAL_PERMISSION_SELECT_ID}
        inputRef={(c) => {
          permission = c;
        }}
        labelId={labelId}
        defaultValue={DEFAULT_PERMISSION_LEVEL}
        label={t('Permission')}
      >
        {Object.values(PERMISSION_LEVELS).map((p) => (
          <MenuItem
            key={buildPermissionOptionId(p)}
            id={buildPermissionOptionId(p)}
            value={p}
          >
            {p}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const open = settings.get('open');

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Share Item')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={1} alignItems="center" justify="center">
          <Grid item xs={8}>
            <TextField
              className={classes.emailInput}
              id={SHARE_ITEM_MODAL_EMAIL_INPUT_ID}
              variant="outlined"
              inputRef={(c) => {
                email = c;
              }}
              label={t('Email')}
            />
          </Grid>
          <Grid item xs={3}>
            {renderPermissionSelect()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          onClick={submit}
          color="primary"
          id={SHARE_ITEM_MODAL_SHARE_BUTTON_ID}
        >
          {t('Share')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ShareItemModal.propTypes = {
  settings: PropTypes.instanceOf(Map).isRequired,
  classes: PropTypes.shape({
    dialogContent: PropTypes.string.isRequired,
    formControl: PropTypes.string.isRequired,
    emailInput: PropTypes.string.isRequired,
  }).isRequired,
  dispatchSetShareModalSettings: PropTypes.func.isRequired,
};

const mapStateToProps = ({ layout }) => ({
  settings: layout.get('shareModal'),
});

const mapDispatchToProps = {
  dispatchSetShareModalSettings: setShareModalSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShareItemModal);

const StyledComponent = withStyles(styles)(ConnectedComponent);
export default StyledComponent;
