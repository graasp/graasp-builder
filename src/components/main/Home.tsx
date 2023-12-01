import { useState } from 'react';

import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { HOME_ERROR_ALERT_ID, OWNED_ITEMS_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemHeader from '../item/header/ItemHeader';
import ItemActions from './ItemActions';
import Items from './Items';
import Main from './Main';
import NewItemButton from './NewItemButton';

const HomeLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember } = useCurrentUserContext();
  const [showOnlyMe, setShowOnlyMe] = useState(true);

  const [page, setPage] = useState(1);
  const itemSearch = useItemSearch({ onSearch: () => setPage(1) });
  const { data, isLoading, isError, isSuccess } = hooks.useAccessibleItems(
    {
      // todo: in the future this can be any member from creators
      creatorId: showOnlyMe ? currentMember?.id : undefined,
      name: itemSearch.text,
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

  return (
    <UppyContextProvider enable={isSuccess}>
      <FileUploader />
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={OWNED_ITEMS_ID}
          defaultSortedColumn={{ updatedAt: 'desc' }}
          title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
          items={data.data}
          headerElements={[itemSearch.input, <NewItemButton key="newButton" />]}
          ToolbarActions={ItemActions}
          onShowOnlyMeChange={onShowOnlyMeChange}
          showOnlyMe={showOnlyMe}
          page={page}
          setPage={setPage}
          totalCount={data.totalCount}
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
