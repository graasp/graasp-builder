import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
    display: 'flex',
    alignItems: 'center',
    wordBreak: 'break-word',
    fontSize: '2em',
  },
  highlight: {
    background: theme.palette.primary.main,
    color: 'white',
  },
}));

const ItemsToolbar = ({ title, headerElements }) => {
  const classes = useToolbarStyles();

  return (
    <>
      <Toolbar className={classes.root}>
        <Typography className={classes.title} variant="h4" component="div">
          {title}
        </Typography>
        {headerElements}
      </Toolbar>
    </>
  );
};

ItemsToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  headerElements: PropTypes.arrayOf(PropTypes.element),
};

ItemsToolbar.defaultProps = {
  headerElements: null,
};

export default ItemsToolbar;
