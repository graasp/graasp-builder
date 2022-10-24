import { List } from 'immutable';
import PropTypes from 'prop-types';

import { useContext } from 'react';

import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const { useManyItemMemberships } = hooks;

const Items = ({
  items,
  title,
  id,
  headerElements,
  actions,
  ToolbarActions,
  clickable,
  defaultSortedColumn,
  isEditing,
  parentId,
  showThumbnails,
  showCreator,
  enableMemberships,
}) => {
  const { mode } = useContext(LayoutContext);
  const itemSearch = useItemSearch(items);
  const { data: memberships, isLoading: isMembershipsLoading } =
    useManyItemMemberships(
      enableMemberships
        ? itemSearch?.results?.map(({ id: itemId }) => itemId).toJS()
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
          id={id}
          parentId={parentId}
          title={title}
          items={itemSearch.results}
          memberships={memberships}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={[itemSearch.input, ...headerElements]}
          clickable={clickable}
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
          memberships={memberships}
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

Items.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  headerElements: PropTypes.arrayOf(PropTypes.element),
  // eslint-disable-next-line react/forbid-prop-types
  actions: PropTypes.any,
  ToolbarActions: PropTypes.func,
  clickable: PropTypes.bool,
  defaultSortedColumn: PropTypes.shape({
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
  parentId: PropTypes.string,
  showThumbnails: PropTypes.bool,
  showCreator: PropTypes.bool,
  enableMemberships: PropTypes.bool,
};

Items.defaultProps = {
  id: null,
  headerElements: [],
  actions: null,
  ToolbarActions: null,
  clickable: true,
  defaultSortedColumn: {},
  isEditing: false,
  parentId: null,
  showThumbnails: true,
  showCreator: false,
  enableMemberships: true,
};

export default Items;
