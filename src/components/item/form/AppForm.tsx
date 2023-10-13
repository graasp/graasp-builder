import { useState } from 'react';

import { ArrowBack } from '@mui/icons-material';
import { Alert, Stack, TextField } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_URL_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import { buildAppExtra } from '../../../utils/itemExtra';
import NameForm from './NameForm';

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  updatedProperties: Partial<DiscriminatedItem>;
};

const AppForm = ({ onChange, updatedProperties = {} }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [isCustomApp, setIsCustomApp] = useState<boolean>(false);

  const handleAppSelection = (
    newValue: null | { url: string; name: string },
  ) => {
    // there is a new value to use
    if (newValue) {
      onChange({
        name: newValue.name,
        // todo: use better type here (partial of discriminated item is not a good type)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        extra: buildAppExtra({
          url: newValue.url,
        }),
      });
      return;
    }
    // there is no new value to use
    if (!newValue) {
      // eslint-disable-next-line no-console
      console.log('got null value');
      // unset the name and the url in the extra
      onChange({ name: undefined, extra: undefined });
    }
  };

  const { useApps } = hooks;
  const { data, isLoading: isAppsLoading } = useApps();

  const currentUrl =
    updatedProperties.type === ItemType.APP
      ? updatedProperties.extra?.app?.url
      : '';

  const addCustomApp = () => {
    setIsCustomApp(true);
    handleAppSelection(null);
  };

  if (data) {
    return (
      <Stack direction="column" height="100%" spacing={2}>
        <Typography variant="h6">
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
        </Typography>

        {isCustomApp ? (
          <Stack direction="column" alignItems="start" mt={1} spacing={2}>
            <Button
              startIcon={<ArrowBack fontSize="small" />}
              variant="text"
              onClick={() => {
                setIsCustomApp(false);
                handleAppSelection(null);
              }}
            >
              {translateBuilder(BUILDER.CREATE_NEW_APP_BACK_TO_APP_LIST_BUTTON)}
            </Button>
            <Typography>
              {translateBuilder(BUILDER.CREATE_CUSTOM_APP_HELPER_TEXT)}
            </Typography>
            <TextField
              id={CUSTOM_APP_URL_ID}
              fullWidth
              variant="standard"
              autoFocus
              label={translateBuilder(BUILDER.APP_URL)}
              onChange={(e) =>
                // todo: use better type here (partial of discriminated item is not a good type)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onChange({ extra: buildAppExtra({ url: e.target.value }) })
              }
              value={currentUrl}
            />
          </Stack>
        ) : (
          <Grid2 container spacing={2} alignItems="stretch" overflow="scroll">
            {data?.map((ele) => (
              <AppCard
                key={ele.name}
                name={ele.name}
                description={ele.description}
                image={ele.extra.image}
                selected={ele.url === currentUrl}
                onClick={() => {
                  if (ele.url === currentUrl) {
                    // reset fields
                    // eslint-disable-next-line no-console
                    console.log('reset');
                    handleAppSelection(null);
                  } else {
                    handleAppSelection({ url: ele.url, name: ele.name });
                  }
                }}
              />
            ))}
            <AppCard
              name={translateBuilder(BUILDER.CREATE_CUSTOM_APP)}
              description={translateBuilder(
                BUILDER.CREATE_CUSTOM_APP_DESCRIPTION,
              )}
              onClick={addCustomApp}
            />
          </Grid2>
        )}
        <NameForm setChanges={onChange} updatedProperties={updatedProperties} />
      </Stack>
    );
  }

  if (isAppsLoading) {
    return <Skeleton height={60} />;
  }

  return <Alert>{translateBuilder(BUILDER.APP_LIST_LOADING_FAILED)}</Alert>;
};

export default AppForm;
