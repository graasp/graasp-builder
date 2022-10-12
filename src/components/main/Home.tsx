import Container from '@mui/material/Container';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Loader } from '@graasp/ui';

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
  const { t } = useTranslation();
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
        <Container>
          <ItemHeader showNavigation={false} />
          <Items
            defaultSortedColumn={{ updatedAt: 'desc' }}
            id={OWNED_ITEMS_ID}
            title={t('My Items')}
            items={ownItems}
            headerElements={[
              <NewItemButton key="newButton" fontSize="small" />,
            ]}
            ToolbarActions={ItemActionsRenderer}
          />
        </Container>
      </UppyContextProvider>
    </Main>
  );
};

export default Home;
