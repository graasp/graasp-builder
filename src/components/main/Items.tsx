import { List } from 'immutable';

import { ItemRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const { useManyItemMemberships } = hooks;

type Props = {
  id: string;
  items: List<ItemRecord>;
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
  const { data: manyMemberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(
      enableMemberships
        ? itemSearch?.results?.map(({ id: itemId }) => itemId).toArray()
        : [],
    );
  // todo: disable depending on showCreator
  const { data: creators } = hooks.useMembers(
    Object.keys(items?.groupBy(({ creator }) => creator)?.toJS() ?? []),
  );

  if (isMembershipsLoading) {
    return <Loader />;
  }

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          parentId={parentId}
          title={title}
          items={itemSearch.results}
          manyMemberships={manyMemberships}
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
          items={itemSearch.results}
          manyMemberships={manyMemberships}
          headerElements={[itemSearch.input, ...headerElements]}
          isSearching={Boolean(itemSearch.text)}
          ToolbarActions={ToolbarActions}
          clickable={clickable}
          isEditing={isEditing}
          showThumbnails={showThumbnails}
          showCreator={showCreator}
          creators={creators}
        />
      );
  }
};

export default Items;
