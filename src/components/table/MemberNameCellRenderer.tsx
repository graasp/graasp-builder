import { Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

type Props = {
  defaultValue: string;
};

type ChildProps = {
  data: DiscriminatedItem;
};

const MemberNameCellRenderer = ({
  defaultValue,
}: Props): ((childProps: ChildProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildProps): JSX.Element => {
    // users might contain null users
    const user = item.creator;

    return <Typography noWrap>{user?.name ?? defaultValue}</Typography>;
  };

  return ChildComponent;
};

export default MemberNameCellRenderer;
