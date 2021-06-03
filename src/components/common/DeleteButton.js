import React from 'react';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';
import {
  DELETE_ITEMS_MUTATION_KEY,
  DELETE_ITEM_MUTATION_KEY,
} from '../../config/keys';

const DeleteButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();
  const { mutate: deleteItems } = useMutation(DELETE_ITEMS_MUTATION_KEY);
  const { mutate: deleteItem } = useMutation(DELETE_ITEM_MUTATION_KEY);

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
