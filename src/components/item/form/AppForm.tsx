import { RecordOf } from 'immutable';

import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { FC, HTMLAttributes, useState } from 'react';

import { App, DiscriminatedItem, UnknownExtra, getAppExtra } from '@graasp/sdk';
import { AppItemTypeRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import {
  ITEM_FORM_APP_URL_ID,
  buildItemFormAppOptionId,
} from '../../../config/selectors';
import { buildAppExtra } from '../../../utils/itemExtra';
import BaseItemForm from './BaseItemForm';

type Props = {
  onChange: (item: Partial<DiscriminatedItem<UnknownExtra>>) => void;
  item?: AppItemTypeRecord;
  updatedProperties: Partial<DiscriminatedItem<UnknownExtra>>;
};

const AppForm: FC<Props> = ({ onChange, item, updatedProperties = {} }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [newName, setNewName] = useState(item?.name);

  // todo: not clear if newValue is a string or object
  const handleAppSelection = (_event: any, newValue: RecordOf<App> | null) => {
    const url = newValue?.url;
    const name = newValue?.name ?? item?.name;
    // TODO: improve types
    const props = {
      ...item,
      extra: buildAppExtra({ url }),
    } as unknown as DiscriminatedItem<UnknownExtra>;
    if (name) {
      setNewName(name);
      props.name = name;
    }
    onChange(props);
  };
  // todo: not clear if newValue is a string or object
  const handleAppInput = (_event: any, url: string) => {
    // TODO: improve types
    const props = {
      ...item,
      extra: buildAppExtra({ url }),
    } as unknown as DiscriminatedItem<UnknownExtra>;
    onChange(props);
  };

  const { useApps } = hooks;
  const { data, isLoading: isAppsLoading } = useApps();

  const url = getAppExtra(item?.extra)?.url;

  return (
    <div>
      <Typography variant="h6">
        {translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
      </Typography>
      <BaseItemForm
        onChange={onChange}
        item={item?.update('name', () => newName)}
        updatedProperties={updatedProperties}
      />

      {isAppsLoading ? (
        <Skeleton height={60} />
      ) : (
        <Autocomplete
          id={ITEM_FORM_APP_URL_ID}
          options={data?.toArray() ?? []}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            return option.url;
          }}
          filterOptions={(options, state) => {
            const filteredOptionsByName = options.filter((opt: RecordOf<App>) =>
              opt.name.toLowerCase().includes(state.inputValue.toLowerCase()),
            );
            return filteredOptionsByName;
          }}
          value={data.find((app) => app.url === url) || url}
          clearOnBlur={false}
          onChange={handleAppSelection}
          onInputChange={handleAppInput}
          renderOption={(
            props: HTMLAttributes<HTMLLIElement>,
            option: RecordOf<App>,
          ) => (
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
                src={option.extra?.image as string}
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
              variant="standard"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label={translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_URL_LABEL)}
            />
          )}
        />
      )}
    </div>
  );
};

export default AppForm;
