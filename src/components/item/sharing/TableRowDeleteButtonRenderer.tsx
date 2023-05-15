import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Invitation, ItemMembership } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { useIsParentInstance } from '../../../utils/item';

type ChildCompProps = { data: Invitation | ItemMembership };

export type TableRowDeleteButtonRendererProps = {
  item: ItemRecord;
  buildIdFunction: (id: string) => string;
  tooltip?: string;
  color?: IconButtonProps['color'];
  onDelete: (args: { instance: ChildCompProps['data'] }) => void;
};

const TableRowDeleteButtonRenderer = ({
  item,
  buildIdFunction,
  tooltip,
  color = 'default',
  onDelete,
}: TableRowDeleteButtonRendererProps): ((
  args: ChildCompProps,
) => JSX.Element) => {
  const ChildComponent = ({ data }: ChildCompProps) => {
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
          <span>{button}</span>
        </Tooltip>
      );
    };

    return renderButton();
  };

  return ChildComponent;
};

export default TableRowDeleteButtonRenderer;
