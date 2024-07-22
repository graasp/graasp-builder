import { Skeleton, Stack } from '@mui/material';

type LoadingScreenProps = {
  chipsPlaceholder?: boolean;
};
const LoadingScreen = ({
  chipsPlaceholder = false,
}: LoadingScreenProps): JSX.Element => (
  <Stack gap={1}>
    {chipsPlaceholder && <Skeleton variant="rounded" height={40} width={180} />}
    <Stack direction="row" justifyContent="space-between">
      <Skeleton variant="rounded" height={40} width={200} />
      <Stack direction="row" gap={1}>
        <Skeleton variant="rounded" height={40} width={200} />
        <Skeleton variant="rounded" height={40} width={40} />
        <Skeleton variant="rounded" height={40} width={40} />
      </Stack>
    </Stack>
    <Stack gap={1}>
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rounded" height={60} />
    </Stack>
  </Stack>
);

export default LoadingScreen;
