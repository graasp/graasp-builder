import { Box, Grid, Pagination } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { ShowOnlyMeChangeType } from '@/config/types';

import { ITEM_PAGE_SIZE } from '../../config/constants';
import {
  DROPZONE_HELPER_ID,
  ITEMS_GRID_PAGINATION_ID,
} from '../../config/selectors';
import FileUploader from '../file/FileUploader';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';
import FolderDescription from '../item/FolderDescription';
import { NoItemSearchResult } from '../item/ItemSearch';
import { ItemsStatuses } from '../table/BadgesCellRenderer';
import EmptyItem from './EmptyItem';
import ItemCard from './ItemCard';
import ItemsToolbar from './ItemsToolbar';
import NewItemButton from './NewItemButton';

type Props = {
  id?: string;
  items?: PackedItem[];
  itemsStatuses?: ItemsStatuses;
  title: string;
  itemSearch?: {
    text: string;
  };
  headerElements?: JSX.Element[];
  parentId?: string;
  canMove?: boolean;
  showOnlyMe?: boolean;
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
  totalCount?: number;
  onPageChange: any;
  page?: number;
  canEdit?: boolean;
};

const ItemsGrid = ({
  id: gridId = '',
  items = [],
  title,
  itemSearch,
  headerElements = [],
  itemsStatuses,
  parentId,
  onShowOnlyMeChange,
  canMove = true,
  canEdit = true,
  showOnlyMe,
  totalCount = 0,
  onPageChange,
  page = 1,
}: Props): JSX.Element => {
  const {
    update,
    close: closeNotification,
    closeAndShowError,
    show,
  } = useUploadWithProgress();
  const pagesCount = Math.ceil(Math.max(1, totalCount / ITEM_PAGE_SIZE));
  const renderItems = () => {
    if (!items?.length) {
      // we need to show toast notifications since the websockets reset the view as soon as one file is uploaded
      if (itemSearch?.text) {
        return (
          <Box py={1} px={2} width="100%">
            <NoItemSearchResult />
          </Box>
        );
      }
      if (canEdit) {
        return (
          <Box py={1} px={2} width="100%">
            <FileUploader
              id={DROPZONE_HELPER_ID}
              onStart={show}
              onComplete={closeNotification}
              onError={closeAndShowError}
              onUpdate={update}
              buttons={<NewItemButton size="small" />}
            />
          </Box>
        );
      }
      return <EmptyItem />;
    }

    return items.map((item) => (
      <Grid key={item.id} item xs={12} sm={12} md={6} lg={6} xl={4}>
        <ItemCard canMove={canMove} item={item} itemsStatuses={itemsStatuses} />
      </Grid>
    ));
  };

  return (
    <div id={gridId}>
      <ItemsToolbar
        title={title}
        subTitleElement={<FolderDescription itemId={parentId} />}
        headerElements={headerElements}
        onShowOnlyMeChange={onShowOnlyMeChange}
        showOnlyMe={showOnlyMe}
      />

      <Grid container spacing={2}>
        {renderItems()}
      </Grid>
      <Box p={2} alignItems="center" display="flex" justifyContent="center">
        <Pagination
          id={ITEMS_GRID_PAGINATION_ID}
          count={pagesCount}
          page={page}
          onChange={(_e, v) => onPageChange(v)}
        />
      </Box>
    </div>
  );
};

export default ItemsGrid;
