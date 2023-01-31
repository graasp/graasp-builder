import { List } from 'immutable';

import { useEffect, useState } from 'react';

import {
  ItemMembershipRecord,
  ItemRecord,
  MemberRecord,
} from '@graasp/query-client/dist/types';

import {
  getMembershipsForItem,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import EditButton from '../common/EditButton';
import DownloadButton from '../main/DownloadButton';
import ItemMenu from '../main/ItemMenu';

type Props = {
  membershipLists: List<List<ItemMembershipRecord>>;
  items: List<ItemRecord>;
  member: MemberRecord;
};

type ChildProps = { data: ItemRecord };

// items and memberships match by index
const ActionsCellRenderer = ({
  membershipLists,
  items,
  member,
}: Props): ((props: ChildProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildProps) => {
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
      if (
        items &&
        membershipLists &&
        !membershipLists.isEmpty() &&
        !items.isEmpty()
      ) {
        setCanEdit(
          isItemUpdateAllowedForUser({
            memberships: getMembershipsForItem({
              item,
              items,
              membershipLists,
            }),
            memberId: member?.id,
          }),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, membershipLists, item, member]);

    const renderAnyoneActions = () => (
      <ItemMenu item={item} canEdit={canEdit} />
    );

    const renderEditorActions = () => {
      if (!canEdit) {
        return null;
      }

      return (
        <>
          <EditButton item={item} />
          <DownloadButton id={item?.id} name={item?.name} />
        </>
      );
    };

    return (
      <>
        {renderEditorActions()}
        {renderAnyoneActions()}
      </>
    );
  };

  return ChildComponent;
};

export default ActionsCellRenderer;
