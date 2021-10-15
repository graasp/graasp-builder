import PropTypes from 'prop-types';
import React from 'react';
import EditButton from '../common/EditButton';
import ShareButton from '../common/ShareButton';
import ItemMenu from '../main/ItemMenu';
import { hooks } from '../../config/queryClient';
import FavoriteButton from '../common/FavoriteButton';
import PinButton from '../common/PinButton';

const { useCurrentMember } = hooks;

const ActionsCellRenderer = ({ data: item }) => {
  const { data: member } = useCurrentMember();

  return (
    <>
      <PinButton item={item} />
      <FavoriteButton member={member} item={item} />
      <EditButton item={item} />
      <ShareButton itemId={item.id} />
      <ItemMenu item={item} member={member} />
    </>
  );
};

ActionsCellRenderer.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default ActionsCellRenderer;
