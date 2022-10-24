import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';

const ItemsToolbar = ({ title, headerElements }) => (
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

ItemsToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  headerElements: PropTypes.arrayOf(PropTypes.element),
};

ItemsToolbar.defaultProps = {
  headerElements: null,
};

export default ItemsToolbar;
