import { ChangeEventHandler } from 'react';

import Clear from '@mui/icons-material/Clear';
import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import { OpenStreetMapResult, useSearchAddress } from './hooks';

const GeolocationPicker = ({
  item,
}: {
  item: DiscriminatedItem;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { data: geoloc } = hooks.useItemGeolocation(item.id);
  const { mutate: putGeoloc } = mutations.usePutItemGeolocation();
  const { mutate: deleteGeoloc } = mutations.useDeleteItemGeolocation();

  const {
    query,
    setQuery,
    isDebounced,
    setResults,
    results,
    loading,
    clearQuery,
  } = useSearchAddress({
    lang: item.lang,
    geoloc,
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  const onChangeOption = (option: OpenStreetMapResult): void => {
    const {
      raw: { lat, lon: lng },
      label,
    } = option;
    putGeoloc({
      itemId: item.id,
      geolocation: {
        lng: parseFloat(lng),
        lat: parseFloat(lat),
        addressLabel: label,
      },
    });
    setResults([]);
  };

  const clearGeoloc = () => {
    deleteGeoloc({ itemId: item.id });
    clearQuery();
  };

  // the input is disabled if the geoloc is defined in parent
  // but it should be enabled if the geoloc is not defined
  const isDisabled = Boolean(geoloc && geoloc?.item?.id !== item.id);

  return (
    <Stack mt={2}>
      <Stack>
        <Typography variant="h6">
          {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_TITLE)}
        </Typography>
        <Typography variant="subtitle1">
          {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_EXPLANATION)}
        </Typography>
      </Stack>
      <Stack direction="row">
        <Stack flexGrow={1}>
          <TextField
            disabled={isDisabled}
            fullWidth
            multiline
            placeholder={t(BUILDER.ITEM_SETTINGS_GEOLOCATION_PLACEHOLDER)}
            onChange={onChange}
            value={query}
          />
          {loading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
        </Stack>
        {query && !isDisabled && (
          <Stack>
            <Tooltip title={t(BUILDER.ITEM_SETTINGS_CLEAR_GEOLOCATION)}>
              <IconButton onClick={clearGeoloc}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
      {isDisabled && (
        <Typography variant="caption">
          {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_INHERITED_EXPLANATION)}
        </Typography>
      )}
      <Stack>
        {results && (
          <List>
            {results.map((r) => (
              <ListItemButton
                key={r.raw.osm_id}
                onClick={() => onChangeOption(r)}
              >
                {r.label}
              </ListItemButton>
            ))}
            {!results.length &&
              query &&
              query !== geoloc?.addressLabel &&
              !loading &&
              !isDebounced &&
              t(BUILDER.ITEM_SETTINGS_GEOLOCATION_NO_ADDRESS)}
          </List>
        )}
      </Stack>
    </Stack>
  );
};

export default GeolocationPicker;
