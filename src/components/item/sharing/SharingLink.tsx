import { useEffect, useState } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import { SelectChangeEvent, Stack, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import { Context } from '@graasp/sdk';
import {
  BUILDER,
  FAILURE_MESSAGES,
  SUCCESS_MESSAGES,
} from '@graasp/translations';

import {
  SHARE_LINK_COLOR,
  SHARE_LINK_CONTAINER_BORDER_STYLE,
  SHARE_LINK_CONTAINER_BORDER_WIDTH,
} from '../../../config/constants';
import {
  useBuilderTranslation,
  useEnumsTranslation,
  useMessagesTranslation,
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

const StyledBox = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  borderWidth: SHARE_LINK_CONTAINER_BORDER_WIDTH,
  borderStyle: SHARE_LINK_CONTAINER_BORDER_STYLE,
  padding: theme.spacing(1),
  margin: theme.spacing(1, 'auto'),
  width: '80%',
  position: 'relative',
}));

const StyledLink = styled(Link)(() => ({
  color: SHARE_LINK_COLOR,
  textDecoration: 'none !important',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

type Props = {
  itemId?: string;
};

const SharingLink = ({ itemId }: Props): JSX.Element => {
  const { t: translateMessages } = useMessagesTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: enumT } = useEnumsTranslation();

  const [linkType, setLinkType] = useState<Context>(Context.Player);
  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (itemId) {
      switch (linkType) {
        case Context.Builder: {
          setLink(buildGraaspBuilderView(itemId));
          break;
        }
        case Context.Player: {
          setLink(buildGraaspPlayerView(itemId));
          break;
        }
        default:
          setLinkType(Context.Builder);
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
          notifier({
            type: COPY_ITEM_LINK_TO_CLIPBOARD.SUCCESS,
            payload: {
              message: translateMessages(
                SUCCESS_MESSAGES.COPY_LINK_TO_CLIPBOARD,
              ),
            },
          });
        },
        onError: () => {
          notifier({
            type: COPY_ITEM_LINK_TO_CLIPBOARD.FAILURE,
            payload: {
              message: translateMessages(
                FAILURE_MESSAGES.COPY_LINK_TO_CLIPBOARD_ERROR,
              ),
            },
          });
        },
      });
    }
  };

  const handleLinkTypeChange = (event: SelectChangeEvent<Context>) => {
    setLinkType(event.target.value as Context);
  };

  return (
    <StyledBox
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <StyledLink href={link} target="_blank" id={SHARE_ITEM_DIALOG_LINK_ID}>
        {link}
      </StyledLink>
      <Stack direction="row" alignItems="center">
        <Select
          sx={{ ml: 1, textTransform: 'capitalize' }}
          value={linkType}
          onChange={handleLinkTypeChange}
          renderValue={(value) => enumT(value)}
          id={SHARE_ITEM_DIALOG_LINK_SELECT_ID}
        >
          <MenuItem
            // sx={{ textTransform: 'capitalize' }}
            value={Context.Builder}
          >
            {enumT(Context.Builder)}
          </MenuItem>
          <MenuItem
            // sx={{ textTransform: 'capitalize' }}
            value={Context.Player}
          >
            {enumT(Context.Player)}
          </MenuItem>
        </Select>
        <Tooltip title={translateBuilder(BUILDER.SHARE_ITEM_LINK_COPY_TOOLTIP)}>
          <span>
            <IconButton onClick={handleCopy}>
              <FileCopyIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </StyledBox>
  );
};

export default SharingLink;
