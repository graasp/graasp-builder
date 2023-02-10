import { Grid, Typography } from '@mui/material';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
};
const ItemsToolbar = ({ title, headerElements = null }: Props): JSX.Element => (
  <Grid container mt={1} mb={2}>
    <Grid item md={8}>
      <Typography variant="h4" noWrap>
        {title}
      </Typography>
    </Grid>
    <Grid item md={4} sx={{ display: 'flex', justifyContent: 'right' }}>
      {headerElements}
    </Grid>
  </Grid>
);

export default ItemsToolbar;
