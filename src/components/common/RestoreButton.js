import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Tooltip from '@material-ui/core/Tooltip';
import { RESTORE_ITEMS_BUTTON_CLASS } from '../../config/selectors';

const RestoreButton = ({ itemIds, color }) => {
  const { t } = useTranslation();

  const onClick = () => {
    // restore items
    // eslint-disable-next-line no-console
    console.log(itemIds);
  };

  return (
    <Tooltip title={t('Restore')}>
      <span>
        <IconButton
          aria-label="restore"
          color={color}
          className={RESTORE_ITEMS_BUTTON_CLASS}
          onClick={onClick}
          disabled
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
};
RestoreButton.defaultProps = {
  color: 'default',
};

export default RestoreButton;
