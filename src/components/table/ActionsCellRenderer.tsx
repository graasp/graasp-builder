import {
  ItemMembership,
  Member,
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
  ResultOf,
} from '@graasp/sdk';

import EditButton from '../common/EditButton';
import DownloadButton from '../main/DownloadButton';
import ItemMenu from '../main/ItemMenu';

type Props = {
  manyMemberships?: ResultOf<ItemMembership[]>;
  member?: Member | null;
  canMove?: boolean;
};

type ChildCompProps = {
  data: PackedItem;
};

// items and memberships match by index
const ActionsCellRenderer = ({
  canMove,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const canWrite = item.permission
      ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
      : false;
    const canAdmin = item.permission
      ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
      : false;

    const renderAnyoneActions = () => (
      <>
        <DownloadButton id={item.id} name={item.name} />
        <ItemMenu
          item={item}
          canMove={canMove}
          canAdmin={canAdmin}
          canWrite={canWrite}
        />
      </>
    );

    const renderEditorActions = () => {
      if (canWrite) {
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
