import { ItemRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { hooks } from '../../config/queryClient';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import { useItemsStatuses } from '../table/BadgesCellRenderer';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const { useManyItemMemberships, useItemsTags } = hooks;

type Props = {
  id: string;
  items?: List<ItemRecord>;
  title: string;
  headerElements?: JSX.Element[];
  actions?: ({ data }: { data: { id: string } }) => JSX.Element;
  ToolbarActions?: ({ selectedIds }: { selectedIds: string[] }) => JSX.Element;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt?: 'desc' | 'asc';
    createdAt?: 'desc' | 'asc';
    type?: 'desc' | 'asc';
    name?: 'desc' | 'asc';
  };
  parentId?: string;
  isEditing?: boolean;
  showThumbnails?: boolean;
  showCreator?: boolean;
  enableMemberships?: boolean;
};

const Items = ({
  id,
  items,
  title,
  headerElements = [],
  actions,
  ToolbarActions,
  clickable = true,
  parentId,
  defaultSortedColumn,
  isEditing = false,
  showThumbnails = true,
  showCreator = false,
  enableMemberships = true,
}: Props): JSX.Element => {
  const { mode } = useLayoutContext();
  const itemSearch = useItemSearch(items);
  const itemsToDisplay = itemSearch.results;
  const itemIds = itemsToDisplay?.map(({ id: itemId }) => itemId).toArray();
  const { data: manyMemberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(enableMemberships ? itemIds : []);
  const { data: itemsTags } = useItemsTags(
    itemsToDisplay?.map((r) => r.id).toJS(),
  );
  const itemsStatuses = useItemsStatuses({
    items: itemsToDisplay,
    itemsTags,
  });

  if (isMembershipsLoading) {
    return <Loader />;
  }

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          parentId={parentId}
          title={title}
          items={itemsToDisplay}
          manyMemberships={manyMemberships}
          itemsStatuses={itemsStatuses}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={[itemSearch.input, ...headerElements]}
          isEditing={isEditing}
        />
      );
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return (
        <ItemsTable
          id={id}
          actions={actions}
          tableTitle={title}
          defaultSortedColumn={defaultSortedColumn}
          items={itemsToDisplay}
          manyMemberships={manyMemberships}
          itemsStatuses={itemsStatuses}
          headerElements={[itemSearch.input, ...headerElements]}
          isSearching={Boolean(itemSearch.text)}
          ToolbarActions={ToolbarActions}
          clickable={clickable}
          isEditing={isEditing}
          showThumbnails={showThumbnails}
          showCreator={showCreator}
        />
      );
  }
};

export default Items;
