import { Box, Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
};

const ItemsToolbar = ({ title, headerElements = null }: Props): JSX.Element => (
  <Stack direction="row" justifyContent="space-between" spacing={1}>
    <Box>
      <Typography variant="h4" noWrap>
        {title}
      </Typography>
    </Box>
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      {headerElements}
    </Stack>
  </Stack>
);

export default ItemsToolbar;
