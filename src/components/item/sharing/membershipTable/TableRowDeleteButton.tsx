import { IconButton, Tooltip } from '@mui/material';

import { Trash2 } from 'lucide-react';

export type TableRowDeleteButtonProps = {
  id?: string;
  tooltip?: string;
  onClick: () => void;
  disabled?: boolean;
};

const TableRowDeleteButton = ({
  id,
  tooltip,
  disabled,
  onClick,
}: TableRowDeleteButtonProps): JSX.Element => {
  const renderButton = () => {
    const button = (
      <IconButton disabled={disabled} onClick={onClick} id={id} color="error">
        <Trash2 />
      </IconButton>
    );

    if (!disabled || !tooltip) {
      return button;
    }

    return (
      <Tooltip title={tooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  };

  return renderButton();
};

export default TableRowDeleteButton;
