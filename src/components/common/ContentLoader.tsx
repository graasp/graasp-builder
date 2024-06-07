import { Skeleton } from '@mui/material';

import { SomeBreakPoints } from '@/types/breakpoint';

const DEFAULT_WIDTH = '100%';

type Size = string | number;
type SizeOrBreakPoints = SomeBreakPoints<Size> | Size;

type Props = {
  children: JSX.Element | JSX.Element[];
  isLoading: boolean;
  width?: SizeOrBreakPoints;
  maxWidth?: SizeOrBreakPoints;
  height?: SizeOrBreakPoints;
};

export const ContentLoader = ({
  children,
  isLoading,
  width = DEFAULT_WIDTH,
  maxWidth = DEFAULT_WIDTH,
  height,
}: Props): JSX.Element | JSX.Element[] => {
  if (isLoading) {
    return (
      <Skeleton variant="rounded" sx={{ width, height, maxWidth }}>
        {children}
      </Skeleton>
    );
  }
  return children;
};

export default ContentLoader;
