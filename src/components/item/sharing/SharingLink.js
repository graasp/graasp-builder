import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core';
import {
  SHARE_ITEM_DIALOG_LINK_ID,
  SHARE_ITEM_DIALOG_LINK_SELECT_ID,
} from '../../../config/selectors';
import {
  buildGraaspComposeView,
  buildGraaspPerformView,
} from '../../../config/paths';
import {
  COMPOSE_VIEW_SELECTION,
  PERFORM_VIEW_SELECTION,
  SHARE_ITEM_MODAL_MIN_WIDTH,
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BORDER_STYLE,
  SHARE_LINK_CONTAINER_BORDER_WIDTH,
  SHARE_LINK_WIDTH,
} from '../../../config/constants';
import notifier from '../../../middlewares/notifier';
import { COPY_ITEM_LINK_TO_CLIPBOARD } from '../../../types/clipboard';
import { copyToClipboard } from '../../../utils/clipboard';

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
    margin: theme.spacing(1, 'auto'),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
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

const SharingLink = ({ itemId }) => {
  const { t } = useTranslation();
  const classes = useStyles();

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
          setLinkType(COMPOSE_VIEW_SELECTION);
          break;
      }
    }
    return () => {};
  }, [itemId, linkType]);

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
    <div className={classes.shareLinkContainer}>
      <Link
        className={classes.shareLink}
        href={link}
        target="_blank"
        id={SHARE_ITEM_DIALOG_LINK_ID}
      >
        {link}
      </Link>
      <div>
        <Select
          className={classes.selector}
          value={linkType}
          onChange={handleLinkTypeChange}
          id={SHARE_ITEM_DIALOG_LINK_SELECT_ID}
        >
          <MenuItem value={COMPOSE_VIEW_SELECTION}>{t('Compose')}</MenuItem>
          <MenuItem value={PERFORM_VIEW_SELECTION}>{t('Perform')}</MenuItem>
        </Select>
        <Tooltip title={t('Copy to Clipboard')}>
          <IconButton onClick={handleCopy} className={classes.copyButton}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

SharingLink.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default SharingLink;
