import { DiscriminatedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

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
  items?: DiscriminatedItem[];
  title: string;
  headerElements?: JSX.Element[];
  actions?: ({ data }: { data: DiscriminatedItem }) => JSX.Element;
  ToolbarActions?: ({ selectedIds }: { selectedIds: string[] }) => JSX.Element;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt?: 'desc' | 'asc';
    createdAt?: 'desc' | 'asc';
    type?: 'desc' | 'asc';
    name?: 'desc' | 'asc';
  };
  parentId?: string;
  showThumbnails?: boolean;
  showCreator?: boolean;
  enableMemberships?: boolean;
  canMove?: boolean;
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
  showThumbnails = true,
  showCreator = false,
  enableMemberships = true,
  canMove = true,
}: Props): JSX.Element => {
  const { mode } = useLayoutContext();
  const itemSearch = useItemSearch(items);
  const itemsToDisplay = itemSearch.results;
  const itemIds = itemsToDisplay?.map(({ id: itemId }) => itemId);
  const { data: manyMemberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(enableMemberships ? itemIds : []);
  const { data: itemsTags } = useItemsTags(itemsToDisplay?.map((r) => r.id));
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
          canMove={canMove}
          parentId={parentId}
          title={title}
          items={itemsToDisplay}
          manyMemberships={manyMemberships}
          itemsStatuses={itemsStatuses}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={[itemSearch.input, ...headerElements]}
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
          showThumbnails={showThumbnails}
          showCreator={showCreator}
          canMove={canMove}
        />
      );
  }
};

export default Items;
