import { Link } from 'react-router-dom';

import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { HOME_PATH } from '@/config/paths';

import { BUILDER } from '../langs/constants';

const FallbackComponent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Stack
      direction={['column-reverse', 'row']}
      justifyContent="center"
      alignItems="center"
      height="100svh"
      spacing={4}
    >
      <Box>
        <Typography variant="h1" fontSize="6em">
          {translateBuilder(BUILDER.FALLBACK_TITLE)}
        </Typography>
        <Typography>{translateBuilder(BUILDER.FALLBACK_TEXT)}</Typography>
        <Button
          component={Link}
          to={HOME_PATH}
          sx={{ mt: 3 }}
          reloadDocument
          variant="contained"
        >
          {translateBuilder(BUILDER.FALLBACK_BACK_TO_HOME)}
        </Button>
      </Box>
      <ErrorOutline
        fontSize="large"
        htmlColor="#5050d2"
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '10em',
          aspectRatio: 1,
          height: 'auto',
          maxHeight: '10em',
        }}
      />
    </Stack>
  );
};

export default FallbackComponent;
