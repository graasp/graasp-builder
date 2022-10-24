import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Box, SelectChangeEvent, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import { FC, useEffect, useState } from 'react';

import { Context } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import {
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BORDER_STYLE,
  SHARE_LINK_CONTAINER_BORDER_WIDTH,
} from '../../../config/constants';
import {
  useBuilderTranslation,
  useEnumsTranslation,
} from '../../../config/i18n';
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

type Props = {
  itemId?: string;
};

const SharingLink: FC<Props> = ({ itemId }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: enumT } = useEnumsTranslation();

  const [linkType, setLinkType] = useState<Context>(Context.PLAYER);
  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (itemId) {
      switch (linkType) {
        case Context.BUILDER: {
          setLink(buildGraaspBuilderView(itemId));
          break;
        }
        case Context.PLAYER: {
          setLink(buildGraaspPlayerView(itemId));
          break;
        }
        default:
          setLinkType(Context.BUILDER);
          break;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [itemId, linkType]);

  const handleCopy = () => {
    if (link) {
      copyToClipboard(link, {
        onSuccess: () => {
          notifier({ type: COPY_ITEM_LINK_TO_CLIPBOARD.SUCCESS, payload: {} });
        },
        onError: () => {
          notifier({ type: COPY_ITEM_LINK_TO_CLIPBOARD.FAILURE, payload: {} });
        },
      });
    }
  };

  const handleLinkTypeChange = (event: SelectChangeEvent<Context>) => {
    setLinkType(event.target.value as Context);
  };

  return (
    <StyledBox>
      <StyledLink href={link} target="_blank" id={SHARE_ITEM_DIALOG_LINK_ID}>
        {link}
      </StyledLink>
      <div>
        <Select
          sx={{ ml: 1, textTransform: 'capitalize' }}
          value={linkType}
          onChange={handleLinkTypeChange}
          renderValue={(value) => enumT(value)}
          id={SHARE_ITEM_DIALOG_LINK_SELECT_ID}
        >
          <MenuItem
            // sx={{ textTransform: 'capitalize' }}
            value={Context.BUILDER}
          >
            {enumT(Context.BUILDER)}
          </MenuItem>
          <MenuItem
            // sx={{ textTransform: 'capitalize' }}
            value={Context.PLAYER}
          >
            {enumT(Context.PLAYER)}
          </MenuItem>
        </Select>
        <Tooltip title={translateBuilder(BUILDER.SHARE_ITEM_LINK_COPY_TOOLTIP)}>
          <IconButton onClick={handleCopy} sx={{ p: 0, ml: 1 }}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      </div>
    </StyledBox>
  );
};

export default SharingLink;
