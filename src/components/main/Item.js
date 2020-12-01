import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import CustomCardHeader from './CustomCardHeader';
import { ItemContext } from '../context/item';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const Item = ({ item }) => {
  const classes = useStyles();
  const { deleteItem } = useContext(ItemContext);
  const { id, name, description, creator, type, extra } = item;

  return (
    <Card className={classes.root}>
      <CustomCardHeader id={id} creator={creator} title={name} type={type} />
      <CardMedia className={classes.media} image={extra.image} title={name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* Line below is to limit how much description text is dispalyed, to create consistent card displays
          But fix: There must be a better way of doing it */}
          {`${description?.split(' ').slice(0, 30).join(' ')}...`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => deleteItem(id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    extra: PropTypes.shape({
      image: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Item;
