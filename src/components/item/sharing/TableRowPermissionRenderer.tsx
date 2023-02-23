import { Typography } from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';

import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';

type Props = { item; editFunction; createFunction; readOnly? };

type ChildProps = {
  data: {
    id: string;
    permission: PermissionLevel;
    itemPath: string;
  };
};

const TableRowPermissionRenderer = ({
  item,
  editFunction,
  createFunction,
  readOnly = false,
}: Props): ((props: ChildProps) => JSX.Element) => {
  // todo: use typescript to precise data is one of Invitation or Membership
  const ChildComponent = ({ data: instance }: ChildProps) => {
    const isParentMembership = useIsParentInstance({
      instance,
      item,
    });

    const onChangePermission = (e) => {
      const { value } = e.target;
      // editing a parent's instance from a child should create a new instance
      if (isParentMembership) {
        createFunction({ value, instance });
      } else {
        editFunction({ value, instance });
      }
    };

    return readOnly ? (
      <Typography noWrap>{instance.permission}</Typography>
    ) : (
      <ItemMembershipSelect
        value={instance.permission}
        showLabel={false}
        onChange={onChangePermission}
      />
    );
  };

  return ChildComponent;
};
export default TableRowPermissionRenderer;
