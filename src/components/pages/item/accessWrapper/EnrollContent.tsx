import { Stack, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { CircleUser } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { ENROLL_BUTTON_SELECTOR } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type Props = { itemId: DiscriminatedItem['id'] };

const EnrollContent = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: enroll } = mutations.useEnroll();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <CircleUser size={40} />
      <Typography variant="h3">
        {translateBuilder(BUILDER.ENROLL_TITLE)}
      </Typography>
      <Typography variant="subtitle2">
        {translateBuilder(BUILDER.ENROLL_DESCRIPTION)}
      </Typography>
      <Button
        dataCy={ENROLL_BUTTON_SELECTOR}
        onClick={() => {
          enroll({ itemId });
        }}
      >
        {translateBuilder(BUILDER.ENROLL_BUTTON)}
      </Button>
    </Stack>
  );
};

export default EnrollContent;
