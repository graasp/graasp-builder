import { useState } from 'react';

import { CheckboxProps, LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';
import { ItemTypesFilterChanged } from '@/config/types';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  ACCESSIBLE_ITEMS_TABLE_ID,
  HOME_ERROR_ALERT_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemHeader from '../item/header/ItemHeader';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import { ItemsTableProps } from '../main/ItemsTable';
import NewItemButton from '../main/NewItemButton';

type HomeItemSortableColumn =
  | 'item.name'
  | 'item.type'
  | 'item.created_at'
  | 'item.updated_at';

const HomeLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember } = useCurrentUserContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] =
    useState<HomeItemSortableColumn>('item.updated_at');
  const [ordering, setOrdering] = useState<'asc' | 'desc'>('desc');
  const itemSearch = useItemSearch({ onSearch: () => setPage(1) });
  const {
    data: accessibleItems,
    isLoading,
    isFetching,
    isSuccess,
  } = hooks.useAccessibleItems(
    {
      // todo: in the future this can be any member from creators
      creatorId: showOnlyMe ? currentMember?.id : undefined,
      name: itemSearch.text,
      sortBy: sortColumn,
      ordering,
      // types: [ItemType.FOLDER],
    },
    // todo: adapt page size given the user window height
    { page, pageSize: ITEM_PAGE_SIZE },
  );

  const onItemTypesChange: ItemTypesFilterChanged = (newTypes) =>
    console.log('new types', newTypes);

  const onShowOnlyMeChange: CheckboxProps['onChange'] = (e) => {
    setShowOnlyMe(e.target.checked);
    setPage(1);
  };

  // todo: this should be a global function but this is not applicable to other tables
  // since they don't use a pagination
  // with a custom table we won't need this anymore
  const onSortChanged: ItemsTableProps['onSortChanged'] = (e) => {
    const sortedColumn = e.columnApi
      .getColumnState()
      .find(({ sort }) => Boolean(sort));

    // todo: remove this code when table is custom
    if (sortedColumn) {
      const { colId, sort } = sortedColumn;
      if (sort) {
        setOrdering(sort);
      }

      // we don't sort by creator because table definition is global
      // we should wait till the table is refactored

      let prop = colId;
      if (colId === 'createdAt') {
        prop = 'created_at';
      }
      if (colId === 'updatedAt') {
        prop = 'updated_at';
      }
      if (['name', 'type', 'created_at', 'updated_at'].includes(prop)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSortColumn(`item.${prop}`);
      }
    } else {
      setSortColumn('item.updated_at');
      setOrdering('desc');
    }
  };

  if (accessibleItems) {
    return (
      <UppyContextProvider enable={isSuccess}>
        <FileUploader />
        <Box m={2}>
          <ItemHeader showNavigation={false} />
          <Items
            id={ACCESSIBLE_ITEMS_TABLE_ID}
            title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
            items={accessibleItems.data}
            headerElements={[
              itemSearch.input,
              <NewItemButton key="newButton" />,
            ]}
            ToolbarActions={ItemActions}
            onTypesChange={onItemTypesChange}
            onShowOnlyMeChange={onShowOnlyMeChange}
            showOnlyMe={showOnlyMe}
            page={page}
            setPage={setPage}
            totalCount={accessibleItems.totalCount}
            onSortChanged={onSortChanged}
            pageSize={ITEM_PAGE_SIZE}
          />
          {isFetching && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </UppyContextProvider>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
};

const HomeScreen = (): JSX.Element => <HomeLoadableContent />;

export default HomeScreen;
