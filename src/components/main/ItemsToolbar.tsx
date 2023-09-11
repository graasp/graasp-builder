import { Grid, Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
};

const ItemsToolbar = ({ title, headerElements }: Props): JSX.Element => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
        {title}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        {headerElements}
      </Stack>
    </Grid>
  </Grid>
);

export default ItemsToolbar;
