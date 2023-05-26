import Box from '@mui/material/Box';

import { FC, useState } from 'react';

import { BUILDER } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';

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
import { Tour } from './TourContext';
import steps from './mainTour';

// interface TourInterface {
//  steps: Step[];
// }

const Home = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [run, setRun] = useState(false);
  // const tourSteps: Step[] = steps;
  // eslint-disable-next-line
  console.log(steps);
  const { data: ownItems, isLoading, isError, isSuccess } = hooks.useOwnItems();

  const handleStartTour = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setRun(!run);
  };

  if (isError) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !ownItems) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }

  return (
    <Tour run={run}>
      <Main>
        <UppyContextProvider enable={isSuccess}>
          <FileUploader />
          <Box mx={2}>
            <Button
              onClick={handleStartTour}
              sx={{
                cursor: 'pointer',
                flex: 'none',
                ml: 1,
              }}
            >
              Start Tour
            </Button>
            <ItemHeader showNavigation={false} />
            <Items
              id={OWNED_ITEMS_ID}
              defaultSortedColumn={{ updatedAt: 'desc' }}
              title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
              items={ownItems}
              headerElements={[<NewItemButton key="newButton" />]}
              ToolbarActions={ItemActionsRenderer}
            />
          </Box>
        </UppyContextProvider>
      </Main>
    </Tour>
  );
};

export default Home;
