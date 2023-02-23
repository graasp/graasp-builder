import { Typography } from '@mui/material';

import { Member } from '@graasp/sdk';
import { ItemRecord, ResultOfRecord } from '@graasp/sdk/frontend';

type Props = {
  users: ResultOfRecord<Member>;
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
    const user = users?.data?.[item.creator.id];

    return <Typography noWrap>{user?.name ?? defaultValue}</Typography>;
  };

  return ChildComponent;
};

export default MemberNameCellRenderer;
