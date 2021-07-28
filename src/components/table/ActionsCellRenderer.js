import PropTypes from 'prop-types';
import React from 'react';
import EditButton from '../common/EditButton';
import ShareButton from '../common/ShareButton';
import DeleteButton from '../common/DeleteButton';
import { buildDeleteButtonId } from '../../config/selectors';
import ItemMenu from '../main/ItemMenu';
import { hooks } from '../../config/queryClient';

const { useCurrentMember } = hooks;

const ActionsCellRenderer = ({ data: item }) => {
  const { data: member } = useCurrentMember();

  return (
    <>
      <EditButton item={item} />
      <ShareButton itemId={item.id} />
      <DeleteButton itemIds={[item.id]} id={buildDeleteButtonId(item.id)} />
      <ItemMenu item={item} member={member} />
    </>
  );
};

ActionsCellRenderer.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default ActionsCellRenderer;
