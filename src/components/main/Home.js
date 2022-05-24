import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { hooks } from '../../config/queryClient';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import FileUploader from '../file/FileUploader';
import { HOME_ERROR_ALERT_ID, OWNED_ITEMS_ID } from '../../config/selectors';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import Main from './Main';
import NewItemButton from './NewItemButton';
import Authorization from '../common/Authorization';
import { UppyContextProvider } from '../file/UppyContext';
import ItemActionsRenderer from './ItemActions';

const Home = () => {
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
        <ItemHeader />
        <Items
          defaultSortedColumn={{ updatedAt: 'desc' }}
          id={OWNED_ITEMS_ID}
          title={t('My Items')}
          items={ownItems}
          headerElements={[<NewItemButton key="newButton" fontSize="small" />]}
          ToolbarActions={ItemActionsRenderer}
        />
      </UppyContextProvider>
    </Main>
  );
};

Home.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
  }).isRequired,
};

export default Authorization()(Home);
