import Clear from '@mui/icons-material/Clear';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import {
  type GeolocationPickerProps,
  GeolocationPicker as MapGeolocationPicker,
} from '@graasp/map';
import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import GeolocationModalButton from './GeolocationModalButton';

const GeolocationPicker = ({
  item,
}: {
  item: DiscriminatedItem;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { data: geoloc } = hooks.useItemGeolocation(item.id);
  const { mutate: putGeoloc } = mutations.usePutItemGeolocation();
  const { mutate: deleteGeoloc } = mutations.useDeleteItemGeolocation();

  const onChangeOption: GeolocationPickerProps['onChangeOption'] = (option: {
    addressLabel: string;
    lat: number;
    lng: number;
    country?: string;
  }): void => {
    const { addressLabel, lat, lng, country } = option;
    putGeoloc({
      itemId: item.id,
      geolocation: {
        addressLabel,
        lat,
        lng,
        country,
      },
    });
  };

  const clearGeoloc = () => {
    deleteGeoloc({ itemId: item.id });
  };

  // the input is disabled if the geoloc is defined in parent
  // but it should be enabled if the geoloc is not defined
  const isDisabled = Boolean(geoloc && geoloc?.item?.id !== item.id);

  return (
    <>
      <Stack mt={2} gap={2}>
        <Stack>
          <Typography variant="h6">
            {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_TITLE)}
          </Typography>
          <Typography variant="subtitle1">
            {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_EXPLANATION)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Stack flexGrow={1}>
            <MapGeolocationPicker
              onChangeOption={onChangeOption}
              initialValue={geoloc?.addressLabel ?? undefined}
              useSuggestionsForAddress={hooks.useSuggestionsForAddress}
            />
          </Stack>
          <Stack>
            <Tooltip title={t(BUILDER.ITEM_SETTINGS_CLEAR_GEOLOCATION)}>
              <IconButton onClick={clearGeoloc}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        {isDisabled && (
          <Typography variant="caption">
            {t(BUILDER.ITEM_SETTINGS_GEOLOCATION_INHERITED_EXPLANATION)}
          </Typography>
        )}
      </Stack>
      <GeolocationModalButton item={item} />
    </>
  );
};

export default GeolocationPicker;
