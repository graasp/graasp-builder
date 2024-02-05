import {
  DiscriminatedItem,
  ItemMembership,
  Member,
  PermissionLevel,
  ResultOf,
} from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

import {
  getHighestPermissionForMemberFromMemberships,
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
  member,
  canMove,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const { data: memberships } = hooks.useItemMemberships(item.id);
    const canEdit = isItemUpdateAllowedForUser({
      memberships,
      memberId: member?.id,
    });
    const canAdmin = member?.id
      ? getHighestPermissionForMemberFromMemberships({
          memberships,
          memberId: member?.id,
        })?.permission === PermissionLevel.Admin
      : false;

    const renderAnyoneActions = () => (
      <>
        <DownloadButton id={item.id} name={item.name} />
        <ItemMenu
          item={item}
          canMove={canMove}
          canAdmin={canAdmin}
          canEdit={canEdit}
        />
      </>
    );

    const renderEditorActions = () => {
      if (canEdit) {
        return <EditButton item={item} />;
      }
      return null;
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
