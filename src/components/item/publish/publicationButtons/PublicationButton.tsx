import { Stack, Typography } from '@mui/material';

import ContentLoader from '@/components/common/ContentLoader';

const getDescriptionElement = (
  description: string | JSX.Element,
): JSX.Element => {
  if (typeof description === 'string') {
    return <Typography>{description}</Typography>;
  }

  return description;
};

type Props = {
  isLoading: boolean;
  description: string | JSX.Element;
  elements: JSX.Element | JSX.Element[];
};

export const PublicationButton = ({
  isLoading,
  description,
  elements,
}: Props): JSX.Element => (
  <ContentLoader isLoading={isLoading}>
    <Stack spacing={4}>
      {getDescriptionElement(description)}

      <Stack justifyContent="center" direction="row" spacing={2}>
        {elements}
      </Stack>
    </Stack>
  </ContentLoader>
);

export default PublicationButton;
