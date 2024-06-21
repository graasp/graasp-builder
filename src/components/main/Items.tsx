import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { DiscriminatedItem, PackedItem, redirect } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { buildItemPath } from '@/config/paths';
import { buildPlayerTabName } from '@/config/selectors';
import { ShowOnlyMeChangeType } from '@/config/types';

import { ItemLayoutMode } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';
import FileUploaderOverlay from '../file/FileUploaderOverlay';
import MapView from '../item/MapView';
import { useItemsStatuses } from '../table/BadgesCellRenderer';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

type Props = {
  id?: string;
  items?: PackedItem[];
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
  canMove?: boolean;
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
  showOnlyMe?: boolean;
  itemSearch?: { text: string };
  page?: number;
  setPage?: (p: number) => void;
  // how many items exist, which can be more than the displayed items
  totalCount?: number;
  onSortChanged?: (e: any) => void;
  pageSize?: number;
  showDropzoneHelper?: boolean;
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
  canMove = true,
  showOnlyMe = false,
  itemSearch,
  page,
  setPage,
  onShowOnlyMeChange,
  totalCount = 0,
  onSortChanged,
  pageSize,
  showDropzoneHelper = false,
}: Props): JSX.Element | null => {
  const { mode } = useLayoutContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsStatuses = useItemsStatuses({
    items,
  });
  switch (mode) {
    case ItemLayoutMode.Map: {
      const viewItem = (item: DiscriminatedItem) => {
        redirect(window, buildGraaspPlayerView(item.id), {
          name: buildPlayerTabName(item.id),
          openInNewTab: false,
        });
      };
      const viewItemInBuilder = (item: DiscriminatedItem) => {
        // navigate to item in map
        navigate({
          pathname: buildItemPath(item.id),
          search: searchParams.toString(),
        });
      };

      return (
        <MapView
          viewItem={viewItem}
          viewItemInBuilder={viewItemInBuilder}
          title={title}
          parentId={parentId}
          height="90%"
        />
      );
    }
    case ItemLayoutMode.Grid:
      return (
        <>
          {totalCount ? <FileUploaderOverlay /> : undefined}
          <ItemsGrid
            canMove={canMove}
            parentId={parentId}
            title={title}
            items={items}
            itemsStatuses={itemsStatuses}
            // This enables the possibility to display messages (item is empty, no search result)
            itemSearch={itemSearch}
            headerElements={headerElements}
            onShowOnlyMeChange={onShowOnlyMeChange}
            showOnlyMe={showOnlyMe}
            page={page}
            onPageChange={setPage}
            totalCount={totalCount}
          />
        </>
      );
    case ItemLayoutMode.List:
    default:
      return (
        <>
          {totalCount ? <FileUploaderOverlay /> : undefined}
          <ItemsTable
            id={id}
            actions={actions}
            tableTitle={title}
            defaultSortedColumn={defaultSortedColumn}
            onSortChanged={onSortChanged}
            items={items}
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
            pageSize={pageSize}
            showDropzoneHelper={showDropzoneHelper}
          />
        </>
      );
  }
};

export default Items;
