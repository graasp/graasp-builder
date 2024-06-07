import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Chip, IconButton, Stack, Tooltip, styled } from '@mui/material';

import { theme } from '@graasp/ui';

import {
  buildLibraryAddButtonHeader,
  buildPublishChip,
  buildPublishChipContainer,
} from '@/config/selectors';

import PublicationAttributeContainer from './PublicationAttributeContainer';

const options = {
  shouldForwardProp: (prop: string) =>
    prop !== 'deleteIconColor' && prop !== 'chipColor',
};
const StyledChip = styled(
  Chip,
  options,
)(({ chipColor }: { chipColor?: string }) => ({
  color: chipColor,
  '& .MuiChip-deleteIcon': {
    color: chipColor,
    opacity: chipColor ? 0.8 : 1.0,
  },
  ':hover': {
    '& .MuiChip-deleteIcon': {
      color: chipColor,
      transform: 'scale(1.05)',
      opacity: 1.0,
    },
  },
  ':active': {
    '& .MuiChip-deleteIcon': {
      transform: 'scale(0.99)',
    },
  },
}));

const computeChipColor = (
  chipColor: string | string[] | undefined,
  idx: number,
) => {
  if (!chipColor) {
    return undefined;
  }
  if (Array.isArray(chipColor)) {
    return chipColor[idx];
  }
  return chipColor;
};

type Props = {
  dataTestId: string;
  title: string;
  attributeDescription: string;
  emptyDataMessage: string;
  data?: string[];
  isLoading?: boolean;
  color?: string | string[];
  onChipDelete: (chipValue: string) => void;
  onAddClicked: () => void;
};

export const PublicationChipContainer = ({
  dataTestId,
  title,
  attributeDescription,
  emptyDataMessage,
  data,
  isLoading = false,
  color,
  onChipDelete,
  onAddClicked,
}: Props): JSX.Element => {
  const chips = (data ?? []).map((d, idx) => (
    <StyledChip
      key={d}
      label={d}
      variant="outlined"
      onDelete={() => onChipDelete(d)}
      data-cy={buildPublishChip(d)}
      chipColor={computeChipColor(color, idx)}
    />
  ));

  const content =
    chips?.length > 0 ? (
      <Stack
        data-cy={buildPublishChipContainer(dataTestId)}
        direction="row"
        gap={1}
        flexWrap="wrap"
        flexGrow={0}
        flexShrink={1}
        p={1}
      >
        {chips}
      </Stack>
    ) : undefined;

  return (
    <PublicationAttributeContainer
      dataTestId={dataTestId}
      title={title}
      titleActionBtn={
        <Tooltip title={attributeDescription}>
          <IconButton
            data-cy={buildLibraryAddButtonHeader(dataTestId)}
            onClick={onAddClicked}
          >
            <AddCircleOutlineIcon htmlColor={theme.palette.primary.main} />
          </IconButton>
        </Tooltip>
      }
      isLoading={isLoading}
      emptyDataMessage={emptyDataMessage}
      attributeDescription={attributeDescription}
      content={content}
      onEmptyClick={onAddClicked}
    />
  );
};

export default PublicationChipContainer;
