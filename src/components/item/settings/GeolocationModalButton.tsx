import { useRef, useState } from 'react';

import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { CountryForm } from '@graasp/map';
import { DiscriminatedItem } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import notifier from '@/config/notifier';
import { hooks, mutations } from '@/config/queryClient';

type Props = {
  item: DiscriminatedItem;
};

export const GeolocationModalButton = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { t: commonT } = useCommonTranslation();
  const [open, setOpen] = useState(false);
  const { data: geoloc } = hooks.useItemGeolocation(item.id);
  const { mutate: saveGeoloc } = mutations.usePutItemGeolocation();

  const helperLabelRef = useRef<HTMLInputElement>(null);
  const addressLabelRef = useRef<HTMLInputElement>(null);
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState<string>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    // eslint-disable-next-line no-console
    console.log(value);
  };

  const onSave = () => {
    const lat = latRef.current?.value ?? geoloc?.lat;
    const lng = lngRef.current?.value ?? geoloc?.lng;

    if (!lat || !lng) {
      notifier({
        type: 'geolocation error',
        payload: { error: new Error('error') },
      });
      return;
    }

    saveGeoloc({
      itemId: item.id,
      geolocation: {
        helperLabel: helperLabelRef.current?.value ?? geoloc?.helperLabel,
        addressLabel: addressLabelRef.current?.value ?? geoloc?.addressLabel,
        country: country ?? geoloc?.country,
        lat: +lat,
        lng: +lng,
      },
    });
    setOpen(false);
  };

  // const onChangeOption: GeolocationPickerProps['onChangeOption'] = (option: {
  //   addressLabel: string;
  //   lat: number;
  //   lng: number;
  //   country?: string;
  // }): void => {
  //   const { addressLabel, lat, lng, country } = option;
  //   // putGeoloc({
  //   //   itemId: item.id,
  //   //   geolocation: {
  //   //     addressLabel,
  //   //     lat,
  //   //     lng,
  //   //     country,
  //   //   },
  //   // });
  // };

  return (
    <>
      <Button variant="text" onClick={handleClickOpen}>
        {t('Advanced')}
      </Button>
      <Dialog onClose={handleClose} open={open} scroll="body">
        <DialogTitle>{t('Geolocation Advanced Settings')}</DialogTitle>

        <DialogContent>
          <Stack gap={2}>
            <Stack>
              <DialogContentText>
                {t(
                  "Any information submitted with this form won't be validated. You are responsible for the accuracy of the data.",
                )}
              </DialogContentText>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack flexGrow={1}>
                <TextField
                  inputRef={latRef}
                  defaultValue={geoloc?.lat}
                  label="latitude"
                  type="number"
                />
              </Stack>
              <Stack flexGrow={1}>
                <TextField
                  inputRef={lngRef}
                  defaultValue={geoloc?.lng}
                  label="longitude"
                  type="number"
                />
              </Stack>
            </Stack>
            <Stack>
              <TextField
                inputRef={addressLabelRef}
                label="Address"
                multiline
                defaultValue={geoloc?.addressLabel ?? undefined}
              />
            </Stack>
            <Stack>
              <TextField
                inputRef={helperLabelRef}
                defaultValue={geoloc?.helperLabel ?? undefined}
                multiline
                label="Complementary information (optional)"
                placeholder="red door on the right, ..."
              />
            </Stack>
            <Stack>
              <CountryForm
                label="Country"
                initialValue={geoloc?.country ?? undefined}
                onChange={(e) => {
                  // eslint-disable-next-line no-console
                  setCountry(e.alpha2);
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text">{commonT('Close')}</Button>
          <Button onClick={onSave}>{commonT('Save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GeolocationModalButton;
