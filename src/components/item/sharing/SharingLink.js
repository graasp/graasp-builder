import PropTypes from 'prop-types';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Box, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BORDER_STYLE,
  SHARE_LINK_CONTAINER_BORDER_WIDTH,
  SHARING_LINK_TYPES,
} from '../../../config/constants';
import notifier from '../../../config/notifier';
import {
  buildGraaspBuilderView,
  buildGraaspPlayerView,
} from '../../../config/paths';
import {
  SHARE_ITEM_DIALOG_LINK_ID,
  SHARE_ITEM_DIALOG_LINK_SELECT_ID,
} from '../../../config/selectors';
import { COPY_ITEM_LINK_TO_CLIPBOARD } from '../../../types/clipboard';
import { copyToClipboard } from '../../../utils/clipboard';

const StyledBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  borderWidth: SHARE_LINK_CONTAINER_BORDER_WIDTH,
  borderStyle: SHARE_LINK_CONTAINER_BORDER_STYLE,
  padding: theme.spacing(1),
  margin: theme.spacing(1, 'auto'),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '80%',
  position: 'relative',
}));

const StyledLink = styled(Link)(() => ({
  color: SHARE_LINK_COLOR,
  textDecoration: 'none !important',
  width: '70%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

const SharingLink = ({ itemId }) => {
  const { t } = useTranslation();

  const [linkType, setLinkType] = useState(null);
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (itemId) {
      switch (linkType) {
        case SHARING_LINK_TYPES.BUILDER: {
          setLink(buildGraaspBuilderView(itemId));
          break;
        }
        case SHARING_LINK_TYPES.PLAYER: {
          setLink(buildGraaspPlayerView(itemId));
          break;
        }
        default:
          setLinkType(SHARING_LINK_TYPES.BUILDER);
          break;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    <StyledBox>
      <StyledLink href={link} target="_blank" id={SHARE_ITEM_DIALOG_LINK_ID}>
        {link}
      </StyledLink>
      <div>
        <Select
          ml={1}
          value={linkType}
          onChange={handleLinkTypeChange}
          id={SHARE_ITEM_DIALOG_LINK_SELECT_ID}
        >
          <MenuItem value={SHARING_LINK_TYPES.BUILDER}>{t('Builder')}</MenuItem>
          <MenuItem value={SHARING_LINK_TYPES.PLAYER}>{t('Player')}</MenuItem>
        </Select>
        <Tooltip title={t('Copy to Clipboard')}>
          <IconButton onClick={handleCopy} p={0} ml={1}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      </div>
    </StyledBox>
  );
};

SharingLink.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default SharingLink;
