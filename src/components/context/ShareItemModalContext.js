import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
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
import {
  COMPOSE_VIEW_SELECTION,
  PERFORM_VIEW_SELECTION,
  SHARE_ITEM_MODAL_MIN_WIDTH,
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BORDER_STYLE,
  SHARE_LINK_CONTAINER_BORDER_WIDTH,
  SHARE_LINK_WIDTH,
} from '../../config/constants';
import {
  buildGraaspComposeView,
  buildGraaspPerformView,
} from '../../config/paths';
import { copyToClipboard } from '../../utils/clipboard';
import notifier from '../../middlewares/notifier';
import { COPY_ITEM_LINK_TO_CLIPBOARD } from '../../types/clipboard';
import AccessIndication from './AccessIndication';

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
    borderRadius: theme.shape.borderRadius,
    borderWidth: SHARE_LINK_CONTAINER_BORDER_WIDTH,
    borderStyle: SHARE_LINK_CONTAINER_BORDER_STYLE,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareLink: {
    color: SHARE_LINK_COLOR,
    textDecoration: 'none !important',
    width: SHARE_LINK_WIDTH,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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

  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);

  const [linkType, setLinkType] = useState(null);
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (itemId) {
      switch (linkType) {
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
  }, [itemId, linkType]);

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
    setLinkType(COMPOSE_VIEW_SELECTION);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const handleCopy = () => {
    copyToClipboard(link, {
      onSuccess: () => {
        notifier({ type: COPY_ITEM_LINK_TO_CLIPBOARD.SUCCESS, payload: {} });
      },
      onError: () => {
        notifier({ type: COPY_ITEM_LINK_TO_CLIPBOARD.FAILURE, payload: {} });
      },
    });
  };

  const handleLinkTypeChange = (event) => {
    setLinkType(event.target.value);
  };

  return (
    <ShareItemModalContext.Provider value={{ openModal }}>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>{t('Share Item')}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {itemId ? (
            <>
              <div className={classes.shareLinkContainer}>
                <Link className={classes.shareLink} href={link} target="_blank">
                  {link}
                </Link>
                <div>
                  <Select
                    className={classes.selector}
                    value={linkType}
                    onChange={handleLinkTypeChange}
                  >
                    <MenuItem value={COMPOSE_VIEW_SELECTION}>
                      {t('Compose')}
                    </MenuItem>
                    <MenuItem value={PERFORM_VIEW_SELECTION}>
                      {t('Perform')}
                    </MenuItem>
                  </Select>
                  <Tooltip title={t('Copy to Clipboard')}>
                    <IconButton
                      onClick={handleCopy}
                      className={classes.copyButton}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <AccessIndication itemId={itemId} onClick={onClose} />
            </>
          ) : (
            <Typography>{t('Item not specified')}</Typography>
          )}
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
