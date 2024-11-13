import { Dispatch } from 'react';
import { useFormContext } from 'react-hook-form';

import { ArrowBack } from '@mui/icons-material';
import { DialogContent, Stack, TextField, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { CUSTOM_APP_URL_ID } from '@/config/selectors';
import { LINK_REGEX } from '@/utils/item';

import { BUILDER } from '../../../../langs/constants';
import { ItemNameField } from '../ItemNameField';

export function CustomAppForm({
  setIsCustomApp,
}: {
  setIsCustomApp: Dispatch<boolean>;
}): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    reset,
    register,
    formState: { errors },
  } = useFormContext<{ name: string; url: string }>();

  return (
    <DialogContent>
      <Stack gap={1} alignItems="flex-start">
        <Button
          startIcon={<ArrowBack fontSize="small" />}
          variant="text"
          onClick={() => {
            setIsCustomApp(false);
            reset({ name: '', url: '' });
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
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={Boolean(errors.url)}
          helperText={errors.url?.message}
          label={translateBuilder(BUILDER.APP_URL)}
          {...register('url', {
            required: true,
            pattern: {
              value: LINK_REGEX,
              message: translateBuilder(BUILDER.LINK_INVALID_MESSAGE),
            },
          })}
        />
        <ItemNameField required autoFocus={false} />
      </Stack>
    </DialogContent>
  );
}
