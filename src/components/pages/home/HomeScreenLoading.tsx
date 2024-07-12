import { Skeleton, Stack } from '@mui/material';

const HomeScreenLoading = (): JSX.Element => (
  <>
    <Skeleton variant="rounded" height={40} />
    <Skeleton variant="rounded" height={30} />
    <Skeleton variant="rounded" height={30} />
    <Stack spacing={2} mt={2}>
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
    </Stack>
  </>
);

export default HomeScreenLoading;
