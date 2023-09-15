import { useState } from 'react';

import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { HOME_ERROR_ALERT_ID, OWNED_ITEMS_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import ItemHeader from '../item/header/ItemHeader';
import ItemActionsRenderer from './ItemActions';
import Items from './Items';
import Main from './Main';
import NewItemButton from './NewItemButton';

const HomeLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = hooks.useOwnItems(page);

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !data) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }
  const { data: ownItems, totalCount } = data;
  const onPageChange = (currentPage: number) => {
    setPage(currentPage);
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
          items={ownItems}
          headerElements={[<NewItemButton key="newButton" />]}
          ToolbarActions={ItemActionsRenderer}
          totalCount={totalCount}
          page={page}
          onPageChange={onPageChange}
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
