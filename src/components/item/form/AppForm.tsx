import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { AppItemType, DiscriminatedItem } from '@graasp/sdk';
import { AppRecord } from '@graasp/sdk/frontend';
import { Button } from '@graasp/ui';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_URL_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import { buildAppExtra } from '../../../utils/itemExtra';
import BaseItemForm from './NameForm';

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  item?: AppItemType;
  updatedProperties: Partial<DiscriminatedItem>;
};

const AppForm = ({
  onChange,
  item,
  updatedProperties = {},
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [newName, setNewName] = useState<string>(item?.name ?? '');
  const [isCustomApp, setIsCustomApp] = useState<boolean>(false);

  const handleAppSelection = (
    newValue: AppRecord | null | { url: string; name: string },
  ) => {
    if (!newValue) {
      return console.error('new value is undefined');
    }

    const url = newValue?.url;
    const name = newValue?.name ?? item?.name;
    // TODO: improve types
    const props = {
      ...item,
      extra: buildAppExtra({ url }),
    } as unknown as AppItemType;
    if (name) {
      setNewName(name);
      props.name = name;
    }
    return onChange(props);
  };

  const { useApps } = hooks;
  const { data, isLoading: isAppsLoading } = useApps();

  const url = (updatedProperties?.extra?.app as { url: string })?.url;

  const addCustomApp = () => {
    setIsCustomApp(true);
    handleAppSelection({ url: '', name: ' ' });
  };

  if (isAppsLoading) {
    return <Skeleton height={60} />;
  }
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
        </Typography>
        {isCustomApp && (
          <Button
            variant="text"
            onClick={() => {
              setIsCustomApp(false);
              handleAppSelection({ url: '', name: '' });
            }}
          >
            Back
          </Button>
        )}
      </Box>
      <BaseItemForm
        setChanges={onChange}
        updatedProperties={
          {
            ...item,
            name: newName,
            ...updatedProperties,
          } as Partial<DiscriminatedItem>
        }
      />
      <br />

      {isCustomApp ? (
        <Box sx={{ mt: 3 }}>
          <TextField
            id={CUSTOM_APP_URL_ID}
            fullWidth
            variant="standard"
            autoFocus
            label={translateBuilder(BUILDER.APP_URL)}
            onChange={(e) =>
              handleAppSelection({ url: e.target.value, name: '' })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setIsCustomApp(false);
                      handleAppSelection({ url: '', name: '' });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            mt: 3,
          }}
        >
          {data?.map((ele) => (
            <AppCard
              key={ele.name}
              url={ele?.url}
              name={ele.name}
              description={ele.description}
              extra={ele?.extra}
              selected={ele?.url === url}
              handleSelect={handleAppSelection}
            />
          ))}
          <AppCard
            name={translateBuilder(BUILDER.CREATE_CUSTOM_APP)}
            handleSelect={addCustomApp}
          />
        </Box>
      )}
    </div>
  );
};

export default AppForm;
