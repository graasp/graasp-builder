import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ItemMemberships from '../item/ItemMemberships';
import {
  COMPOSE_VIEW_SELECTION,
  PERFORM_VIEW_SELECTION,
  SHARE_ITEM_MODAL_MIN_WIDTH,
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BACKGROUND_COLOR,
  SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR,
} from '../../config/constants';
import { LayoutContext } from './LayoutContext';
import {
  buildGraaspComposeView,
  buildGraaspPerformView,
} from '../../config/paths';

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
  shareLinkContainer: {
    backgroundColor: SHARE_LINK_CONTAINER_BACKGROUND_COLOR,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareLink: {
    color: SHARE_LINK_COLOR,
    textDecoration: 'none !important',
  },
  copyButton: {
    padding: theme.spacing(0),
    marginLeft: theme.spacing(1),
  },
  selector: {
    marginLeft: theme.spacing(1),
  },
}));

const ShareItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { setIsItemSettingsOpen } = useContext(LayoutContext);

  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);

  const [linkSource, setLinkSource] = useState(null);
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (itemId) {
      switch (linkSource) {
        case COMPOSE_VIEW_SELECTION: {
          setLink(buildGraaspComposeView(itemId));
          break;
        }
        case PERFORM_VIEW_SELECTION: {
          setLink(buildGraaspPerformView(itemId));
          break;
        }
        default:
          break;
      }
    }
  }, [itemId, linkSource]);

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
    setLinkSource(COMPOSE_VIEW_SELECTION);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const onClickMemberships = () => {
    onClose();
    setIsItemSettingsOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleLinkSourceChange = (event) => {
    setLinkSource(event.target.value);
  };

  return (
    <ShareItemModalContext.Provider value={{ openModal }}>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>{t('Share Item')}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.shareLinkContainer}>
            <Link className={classes.shareLink} href={link} target="_blank">
              {link}
            </Link>
            <div>
              <Select
                className={classes.selector}
                value={linkSource}
                onChange={handleLinkSourceChange}
              >
                <MenuItem value={COMPOSE_VIEW_SELECTION}>
                  {t('Compose')}
                </MenuItem>
                <MenuItem value={PERFORM_VIEW_SELECTION}>
                  {t('Perform')}
                </MenuItem>
              </Select>
              <Tooltip title={t('Copy to Clipboard')}>
                <IconButton onClick={handleCopy} className={classes.copyButton}>
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
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
