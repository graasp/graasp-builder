import { List } from 'immutable';

import { useContext } from 'react';

import { ItemRecord } from '@graasp/query-client/dist/types';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const { useManyItemMemberships } = hooks;

type Props = {
  items: List<ItemRecord>;
  title: string;
  id?: string;
  headerElements?: JSX.Element[];
  // eslint-disable-next-line react/forbid-prop-types
  actions?: any;
  ToolbarActions?: React.FC<{
    selectedIds: string[];
  }>;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt?: 'desc' | 'asc' | null;
    createdAt?: 'desc' | 'asc' | null;
    type?: 'desc' | 'asc' | null;
    name?: 'desc' | 'asc' | null;
  };
  isEditing?: boolean;
  parentId?: string;
  showThumbnails?: boolean;
  showCreator?: boolean;
  enableMemberships?: boolean;
};

const Items = ({
  actions,
  clickable = true,
  defaultSortedColumn,
  enableMemberships = true,
  headerElements = [],
  id,
  isEditing = false,
  items,
  parentId,
  showCreator = false,
  showThumbnails = true,
  title,
  ToolbarActions,
}: Props): JSX.Element => {
  const { mode } = useContext(LayoutContext);
  const itemSearch = useItemSearch(items);
  const { data: memberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(
      enableMemberships
        ? (itemSearch?.results
            ?.map(({ id: itemId }) => itemId)
            .toJS() as string[])
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
          membershipLists={memberships}
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
          membershipLists={memberships}
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
