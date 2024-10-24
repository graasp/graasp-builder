import { MouseEvent } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Stack, SxProps, Tooltip, Typography } from '@mui/material';

import { theme } from '@graasp/ui';

import { WARNING_COLOR } from '@/config/constants';
import {
  buildPublishAttrContainer,
  buildPublishAttrEmptyContainer,
  buildPublishTitleAction,
  buildPublishWarningIcon,
} from '@/config/selectors';

import ContentLoader from '../../common/ContentLoader';

const clickableBoxSx: SxProps = {
  cursor: 'pointer',
  ':hover': {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.01)',
  },
  ':active': {
    transform: 'scale(1.0)',
  },
};

const CONTAINER_BORDER = {
  radius: '8px',
  border: '1px #ddd solid',
};

type Props = {
  dataTestId: string;
  title: string;
  titleIcon?: JSX.Element;
  titleActionBtn?: JSX.Element;
  content?: JSX.Element | JSX.Element[];
  isLoading?: boolean;
  emptyDataMessage?: string;
  attributeDescription?: string;
  onEmptyClick?: () => void;
};

export const PublicationAttributeContainer = ({
  dataTestId,
  title,
  titleIcon,
  titleActionBtn,
  content,
  emptyDataMessage,
  attributeDescription,
  isLoading = false,
  onEmptyClick,
}: Props): JSX.Element => {
  const hasNoData =
    content === undefined || (Array.isArray(content) && content.length === 0);
  const hasData = !hasNoData;

  const buildEmptyPlaceHolder = () => (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      data-cy={buildPublishAttrEmptyContainer(dataTestId)}
    >
      <AddCircleOutlineIcon
        htmlColor={theme.palette.primary.main}
        sx={{ fontSize: 40 }}
      />
      <Typography
        variant="body1"
        color={theme.palette.text.secondary}
        textAlign="center"
      >
        {emptyDataMessage}
      </Typography>
    </Stack>
  );

  const handleOnContainerClick = () => {
    if (hasNoData) {
      onEmptyClick?.();
    }
  };

  // Stop propagation to prevent executing handleOnContainerClick.
  const handleTitleIconClick = (e: MouseEvent) => e.stopPropagation();

  return (
    <ContentLoader isLoading={isLoading}>
      <Stack
        data-cy={buildPublishAttrContainer(dataTestId)}
        border={CONTAINER_BORDER.border}
        borderRadius={CONTAINER_BORDER.radius}
        padding={2}
        onClick={handleOnContainerClick}
        sx={hasNoData ? clickableBoxSx : {}}
        flexBasis="100%"
        spacing={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center">
              {/* The padding allow to align all container titles when buttons are display or not */}
              <Typography variant="body1" fontWeight="bold" pb={1} pt={1}>
                {title}
              </Typography>
              <Box onClick={handleTitleIconClick}>{titleIcon}</Box>
            </Stack>
            {hasData && (
              <Box data-cy={buildPublishTitleAction(dataTestId)}>
                {titleActionBtn}
              </Box>
            )}
          </Stack>
          {hasNoData && (
            <Tooltip title={attributeDescription}>
              <WarningIcon
                htmlColor={WARNING_COLOR}
                data-cy={buildPublishWarningIcon(dataTestId)}
              />
            </Tooltip>
          )}
        </Stack>

        {hasNoData ? buildEmptyPlaceHolder() : content}
      </Stack>
    </ContentLoader>
  );
};

export default PublicationAttributeContainer;
