import { useState } from 'react';

import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';

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
import ItemActions from './ItemActions';
import Items from './Items';
import { ItemsTableProps } from './ItemsTable';
import Main from './Main';
import NewItemButton from './NewItemButton';

type HomeItemSortableColumn = 'name' | 'type' | 'created_at' | 'updated_at';

const HomeLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember } = useCurrentUserContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] =
    useState<HomeItemSortableColumn>('updated_at');
  const [ordering, setOrdering] = useState<'asc' | 'desc'>('desc');
  const itemSearch = useItemSearch({ onSearch: () => setPage(1) });
  const { data, isLoading, isError, isSuccess } = hooks.useAccessibleItems(
    {
      // todo: in the future this can be any member from creators
      creatorId: showOnlyMe ? currentMember?.id : undefined,
      name: itemSearch.text,
      sortBy: sortColumn,
      ordering,
    },
    // todo: adapt page size given the user window height
    { page, pageSize: ITEM_PAGE_SIZE },
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }

  const onShowOnlyMeChange = (e: any) => {
    setShowOnlyMe(e.target.checked);
  };

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
        setSortColumn(prop);
      }
    }
  };

  return (
    <UppyContextProvider enable={isSuccess}>
      <FileUploader />
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={ACCESSIBLE_ITEMS_TABLE_ID}
          title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
          items={data.data}
          headerElements={[itemSearch.input, <NewItemButton key="newButton" />]}
          ToolbarActions={ItemActions}
          onShowOnlyMeChange={onShowOnlyMeChange}
          showOnlyMe={showOnlyMe}
          page={page}
          setPage={setPage}
          totalCount={data.totalCount}
          onSortChanged={onSortChanged}
        />
      </Box>
    </UppyContextProvider>
  );
};

const Home = (): JSX.Element => (
  <Main>
    <HomeLoadableContent />
  </Main>
);

export default Home;
