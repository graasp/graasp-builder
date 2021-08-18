import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import truncate from 'lodash.truncate';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import CustomCardHeader from './CustomCardHeader';
import { DESCRIPTION_MAX_LENGTH } from '../../config/constants';
import { buildDeleteButtonId, buildItemCard } from '../../config/selectors';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';
import { getItemImage } from '../../utils/item';
import FavoriteButton from '../common/FavoriteButton';
import { hooks } from '../../config/queryClient';
import PinButton from '../common/PinButton';

const { useCurrentMember } = hooks;

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
  const { id, name, description } = item;

  const image = getItemImage(item);

  const { data: member } = useCurrentMember();

  return (
    <Card className={classes.root} id={buildItemCard(id)}>
      <CustomCardHeader item={item} />
      <CardMedia className={classes.media} image={image} title={name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {truncate(description, { length: DESCRIPTION_MAX_LENGTH })}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <PinButton member={member} item={item} />
        <FavoriteButton member={member} item={item} />
        <EditButton item={item} />
        <DeleteButton itemIds={[id]} id={buildDeleteButtonId(id)} />
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
