import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { EDIT_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { EditItemModalContext } from '../context/EditItemModalContext';

const EditButton = ({ item }) => {
  const { t } = useTranslation();
  const { openModal } = useContext(EditItemModalContext);

  const handleEdit = () => {
    openModal(item);
  };

  return (
    <Tooltip title={t('Edit')}>
      <IconButton
        aria-label="edit"
        className={EDIT_ITEM_BUTTON_CLASS}
        onClick={handleEdit}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

EditButton.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default EditButton;
