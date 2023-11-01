import { useEffect, useState } from 'react';

import {
  DiscriminatedItem,
  ItemMembership,
  Member,
  ResultOf,
} from '@graasp/sdk';

import {
  getMembershipsForItem,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import EditButton from '../common/EditButton';
import DownloadButton from '../main/DownloadButton';
import ItemMenu from '../main/ItemMenu';

type Props = {
  manyMemberships?: ResultOf<ItemMembership[]>;
  member?: Member | null;
};

type ChildCompProps = {
  data: DiscriminatedItem;
};

// items and memberships match by index
const ActionsCellRenderer = ({
  manyMemberships,
  member,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
      if (manyMemberships && manyMemberships.data) {
        setCanEdit(
          isItemUpdateAllowedForUser({
            memberships: getMembershipsForItem({
              itemId: item.id,
              manyMemberships,
            }),
            memberId: member?.id,
          }),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manyMemberships, item, member]);

    const renderAnyoneActions = () => (
      <>
        <DownloadButton id={item.id} name={item.name} />
        <ItemMenu item={item} canEdit={canEdit} />
      </>
    );

    const renderEditorActions = () => {
      if (!canEdit) {
        return null;
      }

      return <EditButton item={item} />;
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
