import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: 'center',
    height: '100%',
  },
  cardActionArea: {
    height: '100%',
  },
  selected: {
    background: theme.palette.primary.selected,
  },
}));

const ItemTypeButton = ({
  title,
  description,
  Icon,
  handleClick,
  selected,
  id,
}) => {
  const classes = useStyles();

  return (
    <Card
      id={id}
      classes={{ root: classes.card }}
      className={clsx({ [classes.selected]: selected })}
    >
      <CardActionArea onClick={handleClick} className={classes.cardActionArea}>
        <CardContent>
          <Icon style={{ fontSize: 50 }} />
          <div>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ItemTypeButton.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  Icon: PropTypes.any.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

ItemTypeButton.defaultProps = {
  id: null,
  description: '',
};

export default ItemTypeButton;
