import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function TableRowDeleteButton({ id, disabled, tooltip, onClick }) {
  const button = (
    <IconButton disabled={disabled} onClick={onClick} id={id}>
      <CloseIcon />
    </IconButton>
  );

  if (!disabled || !tooltip) {
    return button;
  }

  return (
    <Tooltip title={tooltip}>
      <div>{button}</div>
    </Tooltip>
  );
}

TableRowDeleteButton.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

TableRowDeleteButton.defaultProps = {
  id: '',
  tooltip: null,
};

export default TableRowDeleteButton;
