import { ReactNode } from 'react';

import { Stack } from '@mui/material';

import ContentLoader from '@/components/common/ContentLoader';

import DescriptionElement from './DescriptionElement';

type Props = {
  isLoading: boolean;
  description: ReactNode;
  children?: ReactNode;
};

export const PublicationButton = ({
  isLoading,
  description,
  children = [],
}: Props): JSX.Element => (
  <ContentLoader isLoading={isLoading}>
    <Stack spacing={4}>
      <DescriptionElement description={description} />

      <Stack justifyContent="center" direction="row" spacing={2}>
        {children}
      </Stack>
    </Stack>
  </ContentLoader>
);

export default PublicationButton;
