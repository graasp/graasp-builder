import { List } from 'immutable';

import { Typography } from '@mui/material';

import { ItemRecord, MemberRecord } from '@graasp/sdk/frontend';

type Props = {
  users: List<MemberRecord>;
  defaultValue: string;
};

type ChildProps = {
  data: ItemRecord;
};

const MemberNameCellRenderer = ({
  users,
  defaultValue,
}: Props): ((childProps: ChildProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildProps): JSX.Element => {
    // users might contain null users
    const user = users?.find(({ id }) => id === item.creator);

    return <Typography noWrap>{user?.name ?? defaultValue}</Typography>;
  };

  return ChildComponent;
};

export default MemberNameCellRenderer;
