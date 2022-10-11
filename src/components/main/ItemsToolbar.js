import PropTypes from 'prop-types';

import { styled } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Title = styled(Typography)(() => ({
  flex: '1 1 100%',
  display: 'flex',
  alignItems: 'center',
}));

const ItemsToolbar = ({ title, headerElements }) => (
  <>
    <Toolbar pl={2} pr={1}>
      <Title variant="h4" component="div" noWrap>
        {title}
      </Title>
      {headerElements}
    </Toolbar>
  </>
);

ItemsToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  headerElements: PropTypes.arrayOf(PropTypes.element),
};

ItemsToolbar.defaultProps = {
  headerElements: null,
};

export default ItemsToolbar;
