import PropTypes from 'prop-types';
import React from 'react';
import EditButton from '../common/EditButton';
import ItemMenu from '../main/ItemMenu';
import { hooks } from '../../config/queryClient';
import FavoriteButton from '../common/FavoriteButton';

const { useCurrentMember } = hooks;

const ActionsCellRenderer = ({ data: item }) => {
  const { data: member } = useCurrentMember();

  return (
    <>
      <FavoriteButton member={member} item={item} />
      <EditButton item={item} />
      <ItemMenu item={item} member={member} />
    </>
  );
};

ActionsCellRenderer.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default ActionsCellRenderer;
