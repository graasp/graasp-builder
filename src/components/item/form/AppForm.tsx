import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { FC, useState } from 'react';

import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import {
  ITEM_FORM_APP_URL_ID,
  buildItemFormAppOptionId,
} from '../../../config/selectors';
import { buildAppExtra, getAppExtra } from '../../../utils/itemExtra';
import BaseItemForm from './BaseItemForm';

// todo: use from graasp-sdk
type App = {
  name: string;
  description: string;
  url: string;
  extra: {
    image: string;
  };
};

type Props = {
  onChange: (item: Partial<Item>) => void;
  item: Item;
  updatedProperties: {
    name: string;
    extra: {
      app: {
        url: string;
      };
    };
  };
};

const AppForm: FC<Props> = ({ onChange, item, updatedProperties = {} }) => {
  const { t } = useBuilderTranslation();
  const [newName, setNewName] = useState(item?.name);

  // todo: not clear if newValue is a string or object
  const handleAppUrlInput = (_event: any, newValue: App | string) => {
    const url = newValue; // newValue?.url ?? newValue;
    const name = item?.name; // newValue?.name ?? item?.name;
    const props = { ...item, extra: buildAppExtra({ url }), name: '' };
    if (name) {
      setNewName(name);
      props.name = name;
    }
    onChange(props);
  };

  const { useApps } = hooks;
  const { data, isLoading: isAppsLoading } = useApps();

  const url = getAppExtra(item?.extra)?.url;

  return (
    <div>
      <Typography variant="h6">
        {t(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
      </Typography>
      <BaseItemForm
        onChange={onChange}
        item={{ ...item, name: newName }}
        updatedProperties={updatedProperties}
      />

      {isAppsLoading ? (
        <Skeleton height={60} />
      ) : (
        <Autocomplete
          id={ITEM_FORM_APP_URL_ID}
          options={data?.toArray() ?? []}
          getOptionLabel={(option) => option.url ?? option}
          value={url}
          clearOnBlur={false}
          onChange={handleAppUrlInput}
          onInputChange={handleAppUrlInput}
          renderOption={(props: unknown, option: App) => (
            <li
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              style={{
                display: 'flex',
                padding: 8,
                alignItems: 'center',
              }}
              id={buildItemFormAppOptionId(option.name)}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  margin: 8,
                  height: '30px',
                }}
                src={option.extra?.image}
                alt={option.name}
              />
              <Typography variant="body1" pr={1}>
                {option.name}
              </Typography>
              <Typography variant="caption">{option.description}</Typography>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label={t(BUILDER.CREATE_NEW_ITEM_APP_URL_LABEL)}
            />
          )}
        />
      )}
    </div>
  );
};

export default AppForm;
