import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { ITEM_MENU_EDIT_BUTTON_CLASS } from '../../config/selectors';
import { setEditModalSettings } from '../../actions/layout';

const Item = ({ itemId, dispatchSetEditModalSettings }) => {
  const { t } = useTranslation();

  const handleEdit = () => {
    dispatchSetEditModalSettings({ open: true, itemId });
  };

  return (
    <Tooltip title={t('Edit')}>
      <IconButton
        aria-label="edit"
        className={ITEM_MENU_EDIT_BUTTON_CLASS}
        onClick={handleEdit}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

Item.propTypes = {
  itemId: PropTypes.string.isRequired,
  dispatchSetEditModalSettings: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchSetEditModalSettings: setEditModalSettings,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(Item);

export default ConnectedComponent;
