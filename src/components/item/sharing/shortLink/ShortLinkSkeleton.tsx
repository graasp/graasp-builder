import { Skeleton, Stack, styled } from '@mui/material';

import {
  SHORT_LINK_CONTAINER_BORDER_STYLE,
  SHORT_LINK_CONTAINER_BORDER_WIDTH,
} from '@/config/constants';

const StyledBox = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  borderWidth: SHORT_LINK_CONTAINER_BORDER_WIDTH,
  borderStyle: SHORT_LINK_CONTAINER_BORDER_STYLE,
  padding: theme.spacing(1),
  margin: theme.spacing(1, 'auto'),
  maxWidth: '100%',
}));

const ShortLinkSkeleton = (): JSX.Element => {
  const responsiveDirection = {
    xs: 'column',
    sm: 'row',
  } as const;

  return (
    <StyledBox
      justifyContent="space-between"
      alignItems="center"
      direction={responsiveDirection}
      width={{ xs: '100%', sm: '80%' }}
    >
      <Stack
        direction={responsiveDirection}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <StyledBox minWidth="120px" direction="row" spacing={1} color="white">
          <Skeleton variant="circular" width={25} height={25} />
          <Skeleton variant="text" width={50} />
        </StyledBox>
        <Skeleton variant="text" width={250} />
      </Stack>

      <Stack direction="row" spacing={2.5} mr={1}>
        <Skeleton variant="rounded" width={23} />
        <Skeleton variant="rounded" width={23} />
        <Skeleton variant="rounded" width={23} />
      </Stack>
    </StyledBox>
  );
};

export default ShortLinkSkeleton;
