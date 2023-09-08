import { Box, Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
};

const ItemsToolbar = ({ title, headerElements }: Props): JSX.Element => (
  <Stack direction="row" justifyContent="space-between" spacing={1}>
    <Box sx={{ maxWidth: '50%' }}>
      <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
        {title}
      </Typography>
    </Box>
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      {headerElements}
    </Stack>
  </Stack>
);

export default ItemsToolbar;
