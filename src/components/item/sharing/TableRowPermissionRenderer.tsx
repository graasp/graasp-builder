import Typography from '@mui/material/Typography';

import { Invitation, ItemMembership } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';

type Props = {
  item: ItemRecord;
  editFunction;
  createFunction;
  readOnly?;
};

type ChildProps = Invitation | ItemMembership;

const TableRowPermissionRenderer = ({
  item,
  editFunction,
  createFunction,
  readOnly = false,
}: Props): (({ data }: { data: ChildProps }) => JSX.Element) => {
  // todo: use typescript to precise data is one of Invitation or Membership
  const ChildComponent = ({ data: instance }: { data: ChildProps }) => {
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
