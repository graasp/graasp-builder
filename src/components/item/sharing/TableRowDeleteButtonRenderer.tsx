import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Item, ItemMembership } from '@graasp/sdk';
import { Invitation } from '@graasp/sdk/frontend';

import { useIsParentInstance } from '../../../utils/item';

type Props = {
  item: Item;
  buildIdFunction: (id: string) => string;
  tooltip?: string;
  color?: IconButtonProps['color'];
  onDelete?: (args: { instance: Invitation | ItemMembership }) => void;
};

const TableRowDeleteButtonRenderer = ({
  item,
  buildIdFunction,
  tooltip,
  color = 'default',
  onDelete,
}: Props): ((args: { data: Invitation | ItemMembership }) => JSX.Element) => {
  // todo: use typescript to precise data is one of Invitation or Membership
  const ChildComponent = ({ data }) => {
    const isFromParent = useIsParentInstance({
      instance: data,
      item,
    });

    const disabled = isFromParent;

    const onClick = () => {
      onDelete({ instance: data });
    };

    const renderButton = () => {
      const button = (
        <IconButton
          disabled={disabled}
          onClick={onClick}
          id={buildIdFunction(data.id)}
          color={color}
        >
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
    };

    return renderButton();
  };

  return ChildComponent;
};

export default TableRowDeleteButtonRenderer;
