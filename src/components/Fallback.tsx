import { useNavigate } from 'react-router';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Stack, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { HOME_PATH } from '@/config/paths';

import { BUILDER } from '../langs/constants';

const FallbackComponent = (): JSX.Element => {
  const navigate = useNavigate();
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
        <Typography variant="h1">
          {translateBuilder(BUILDER.FALLBACK_TITLE)}
        </Typography>
        <Typography>{translateBuilder(BUILDER.FALLBACK_TEXT)}</Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate(HOME_PATH)}
        >
          {translateBuilder(BUILDER.FALLBACK_BACK_TO_HOME)}
        </Button>
      </Box>
      <ErrorOutlineIcon
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