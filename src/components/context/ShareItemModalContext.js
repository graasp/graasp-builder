import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import ItemMemberships from '../item/ItemMemberships';
import {
  SHARE_ITEM_MODAL_MIN_WIDTH,
  SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR,
} from '../../config/constants';
import { LayoutContext } from './LayoutContext';

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
    marginTop: theme.spacing(1),
  },
}));

const ShareItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { setIsItemSettingsOpen } = useContext(LayoutContext);

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

  const onClickMemberships = () => {
    onClose();
    setIsItemSettingsOpen(true);
  };

  return (
    <ShareItemModalContext.Provider value={{ openModal }}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('Share Item')}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {/* todo: display perform view link */}
          {itemId}
          <ItemMemberships
            onClick={onClickMemberships}
            id={itemId}
            maxAvatar={SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('Cancel')}
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
