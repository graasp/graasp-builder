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
  canMove?: boolean;
};

type ChildCompProps = {
  data: DiscriminatedItem;
};

// items and memberships match by index
const ActionsCellRenderer = ({
  manyMemberships,
  member,
  canMove,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const canEdit = isItemUpdateAllowedForUser({
      memberships: getMembershipsForItem({
        itemId: item.id,
        manyMemberships,
      }),
      memberId: member?.id,
    });

    const renderAnyoneActions = () => (
      <>
        <DownloadButton id={item.id} name={item.name} />
        <ItemMenu item={item} canMove={canMove} canEdit={canEdit} />
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
