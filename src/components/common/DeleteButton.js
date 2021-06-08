import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { MUTATION_KEYS } from '@graasp/query-client';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMutation } from '../../config/queryClient';
import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';

const { DELETE_ITEMS, DELETE_ITEM } = MUTATION_KEYS;

const DeleteButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();
  const { mutate: deleteItems } = useMutation(DELETE_ITEMS);
  const { mutate: deleteItem } = useMutation(DELETE_ITEM);

  const onClick = () => {
    if (itemIds.length > 1) {
      deleteItems(itemIds);
    } else {
      deleteItem(itemIds);
    }
  };

  return (
    <Tooltip title={t('Delete')}>
      <IconButton
        id={id}
        color={color}
        className={ITEM_DELETE_BUTTON_CLASS}
        aria-label="delete"
        onClick={onClick}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

DeleteButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};

DeleteButton.defaultProps = {
  color: 'default',
  id: '',
};

export default DeleteButton;
