import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ITEM_RECYCLE_BUTTON_CLASS } from '../../config/selectors';
import { useMutation } from '../../config/queryClient';

const RecycleButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();
  const { mutate: recycleItems } = useMutation(MUTATION_KEYS.RECYCLE_ITEMS);

  const handleClick = () => {
    recycleItems(itemIds);
  };

  return (
    <Tooltip title={t('Recycle')}>
      <IconButton
        id={id}
        color={color}
        className={ITEM_RECYCLE_BUTTON_CLASS}
        aria-label="recycle"
        onClick={handleClick}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

RecycleButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};

RecycleButton.defaultProps = {
  color: 'default',
  id: '',
};

export default RecycleButton;
