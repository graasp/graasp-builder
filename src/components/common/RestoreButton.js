import React from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Tooltip from '@material-ui/core/Tooltip';
import { RESTORE_ITEMS_BUTTON_CLASS } from '../../config/selectors';
import { useMutation } from '../../config/queryClient';

const RestoreButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();
  const { mutate: restoreItems } = useMutation(MUTATION_KEYS.RESTORE_ITEMS);

  const onClick = () => {
    // restore items
    restoreItems(itemIds);
  };

  return (
    <Tooltip title={t('Restore')}>
      <span>
        <IconButton
          id={id}
          aria-label="restore"
          color={color}
          className={RESTORE_ITEMS_BUTTON_CLASS}
          onClick={onClick}
        >
          <RestoreFromTrashIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

RestoreButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};
RestoreButton.defaultProps = {
  color: 'default',
  id: null,
};

export default RestoreButton;
