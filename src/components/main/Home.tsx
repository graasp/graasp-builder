import Box from '@mui/material/Box';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { HOME_ERROR_ALERT_ID, OWNED_ITEMS_ID } from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import ItemHeader from '../item/header/ItemHeader';
import ItemActionsRenderer from './ItemActions';
import Items from './Items';
import Main from './Main';
import NewItemButton from './NewItemButton';

const Home: FC = () => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: ownItems, isLoading, isError, isSuccess } = hooks.useOwnItems();

  if (isError) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <UppyContextProvider enable={isSuccess}>
        <FileUploader />
        <Box mx={2}>
          <ItemHeader showNavigation={false} />
          <Items
            defaultSortedColumn={{ updatedAt: 'desc' }}
            id={OWNED_ITEMS_ID}
            title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
            items={ownItems}
            headerElements={[
              <NewItemButton key="newButton" fontSize="small" />,
            ]}
            ToolbarActions={ItemActionsRenderer}
          />
        </Box>
      </UppyContextProvider>
    </Main>
  );
};

export default Home;
