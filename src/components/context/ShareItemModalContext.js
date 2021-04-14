import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_PERMISSION_LEVEL,
  PERMISSION_LEVELS,
  SHARE_ITEM_MODAL_MIN_WIDTH,
} from '../../config/constants';
import { shareItemWith } from '../../actions/membership';
import {
  buildPermissionOptionId,
  SHARE_ITEM_MODAL_EMAIL_INPUT_ID,
  SHARE_ITEM_MODAL_PERMISSION_SELECT_ID,
  SHARE_ITEM_MODAL_SHARE_BUTTON_ID,
} from '../../config/selectors';

const ShareItemModalContext = React.createContext();

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: SHARE_ITEM_MODAL_MIN_WIDTH,
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
}));

const ShareItemModalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  // refs
  let email = '';
  let permission = '';

  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const submit = () => {
    dispatch(
      shareItemWith({
        id: itemId,
        email: email.value,
        permission: permission.value,
      }),
    );
    onClose();
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

  return (
    <ShareItemModalContext.Provider value={{ openModal }}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          <Button onClick={onClose} color="primary">
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
      {children}
    </ShareItemModalContext.Provider>
  );
};

ShareItemModalProvider.propTypes = {
  children: PropTypes.node,
};

ShareItemModalProvider.defaultProps = {
  children: null,
};

export { ShareItemModalProvider, ShareItemModalContext };
