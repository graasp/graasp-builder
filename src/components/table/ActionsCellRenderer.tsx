import { List } from 'immutable';

import { useEffect, useState } from 'react';

import {
  ItemMembershipRecord,
  ItemRecord,
  MemberRecord,
} from '@graasp/sdk/frontend';

import {
  getMembershipsForItem,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import EditButton from '../common/EditButton';
import DownloadButton from '../main/DownloadButton';
import ItemMenu from '../main/ItemMenu';

type Props = {
  items: List<ItemRecord>;
  manyMemberships: List<List<ItemMembershipRecord>>;
  member: MemberRecord;
};

type ChildCompProps = {
  data: ItemRecord;
};

// items and memberships match by index
const ActionsCellRenderer = ({
  manyMemberships,
  items,
  member,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
      if (
        items &&
        manyMemberships &&
        !manyMemberships.isEmpty() &&
        !items.isEmpty()
      ) {
        setCanEdit(
          isItemUpdateAllowedForUser({
            memberships: getMembershipsForItem({
              item,
              manyMemberships,
              items,
            }),
            memberId: member?.id,
          }),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, manyMemberships, item, member]);

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
