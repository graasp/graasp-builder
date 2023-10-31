import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { DiscriminatedItem } from '@graasp/sdk';

import { useIsParentInstance } from '../../../utils/item';

type ChildCompProps<T> = { data: T };

export type TableRowDeleteButtonRendererProps<T> = {
  item: DiscriminatedItem;
  buildIdFunction: (id: string) => string;
  tooltip?: string;
  color?: IconButtonProps['color'];
  onDelete: (args: { instance: T }) => void;
};

function TableRowDeleteButtonRenderer<
  T extends { item: DiscriminatedItem; id: string },
>({
  item,
  buildIdFunction,
  tooltip,
  color = 'default',
  onDelete,
}: TableRowDeleteButtonRendererProps<T>): (
  args: ChildCompProps<T>,
) => JSX.Element {
  const ChildComponent = ({ data }: ChildCompProps<T>) => {
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
}

export default TableRowDeleteButtonRenderer;
