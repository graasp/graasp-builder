import React, { useContext } from 'react';
import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';
import { Card as GraaspCard } from '@graasp/ui';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { DESCRIPTION_MAX_LENGTH } from '../../config/constants';
import { buildItemCard, buildItemLink } from '../../config/selectors';
import EditButton from '../common/EditButton';
import { isItemUpdateAllowedForUser } from '../../utils/membership';
import { getItemImage, stripHtml } from '../../utils/item';
import ItemMenu from './ItemMenu';
import FavoriteButton from '../common/FavoriteButton';
import PinButton from '../common/PinButton';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { buildItemPath } from '../../config/paths';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

const Item = ({ item, memberships }) => {
  const classes = useStyles();
  const { id, name, description } = item;

  const image = getItemImage(item);

  const { data: member } = useContext(CurrentUserContext);
  const enableEdition = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.get('id'),
  });

  const Actions = (
    <>
      {!member.isEmpty() && <FavoriteButton member={member} item={item} />}
      {enableEdition && (
        <>
          <EditButton item={item} />
          <PinButton item={item} />
        </>
      )}
    </>
  );

  return (
    <GraaspCard
      description={truncate(stripHtml(description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      Actions={Actions}
      name={name}
      creator={member?.get('name')}
      ItemMenu={<ItemMenu item={item} canEdit={enableEdition} />}
      image={image}
      cardId={buildItemCard(id)}
      NameWrapper={({ children }) => (
        <Link
          to={buildItemPath(id)}
          id={buildItemLink(id)}
          className={classes.link}
        >
          {children}
        </Link>
      )}
    />
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
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Item;
