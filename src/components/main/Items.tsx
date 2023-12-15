import { DiscriminatedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';
import { useItemsStatuses } from '../table/BadgesCellRenderer';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const { useManyItemMemberships, useItemsTags } = hooks;

type Props = {
  id?: string;
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
  enableMemberships?: boolean;
  canMove?: boolean;
  onShowOnlyMeChange?: (e: any) => any;
  showOnlyMe?: boolean;
  itemSearch?: { text: string };
  page?: number;
  setPage?: (p: number) => void;
  // how many items exist, which can be more than the displayed items
  totalCount?: number;
  onSortChanged?: (e: any) => void;
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
  enableMemberships = true,
  canMove = true,
  showOnlyMe = false,
  itemSearch,
  page,
  setPage,
  onShowOnlyMeChange,
  totalCount = 0,
  onSortChanged,
}: Props): JSX.Element => {
  const { mode } = useLayoutContext();
  const itemIds = items?.map(({ id: itemId }) => itemId);
  const { data: manyMemberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(enableMemberships ? itemIds : []);
  const { data: itemsTags } = useItemsTags(items?.map((r) => r.id));
  const itemsStatuses = useItemsStatuses({
    items,
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
          items={items}
          manyMemberships={manyMemberships}
          itemsStatuses={itemsStatuses}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={headerElements}
          onShowOnlyMeChange={onShowOnlyMeChange}
          showOnlyMe={showOnlyMe}
          page={page}
          onPageChange={setPage}
          totalCount={totalCount}
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
          onSortChanged={onSortChanged}
          items={items}
          manyMemberships={manyMemberships}
          itemsStatuses={itemsStatuses}
          headerElements={headerElements}
          isSearching={Boolean(itemSearch?.text)}
          ToolbarActions={ToolbarActions}
          clickable={clickable}
          showThumbnails={showThumbnails}
          canMove={canMove}
          onShowOnlyMeChange={onShowOnlyMeChange}
          showOnlyMe={showOnlyMe}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
        />
      );
  }
};

export default Items;
