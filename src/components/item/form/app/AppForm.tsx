import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box, DialogActions, DialogTitle, Stack } from '@mui/material';

import {
  DiscriminatedItem,
  ItemGeolocation,
  ItemType,
  buildAppExtra,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../../config/i18n';
import { mutations } from '../../../../config/queryClient';
import AppListForm from './AppListForm';
import { CustomAppForm } from './CustomAppForm';

type Props = {
  onClose: () => void;
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

type Inputs = {
  name: string;
  url: string;
};

const AppForm = ({
  parentId,
  geolocation,
  previousItemId,
  onClose,
}: Props): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const [isCustomApp, setIsCustomApp] = useState<boolean>(false);

  const { mutateAsync: createItem } = mutations.usePostItem();

  const methods = useForm<Inputs>();
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  async function onSubmit(data: Inputs) {
    try {
      await createItem({
        type: ItemType.APP,
        name: data.name,
        extra: buildAppExtra({
          url: data.url,
        }),
        parentId,
        geolocation,
        previousItemId,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const addCustomApp = () => {
    setIsCustomApp(true);
    reset({ name: '', url: '' });
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" height="100%" onSubmit={handleSubmit(onSubmit)}>
        <Stack height="100%">
          <DialogTitle>
            {translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
          </DialogTitle>
          <Stack height="100%" justifyContent="space-between">
            <Stack>
              {isCustomApp ? (
                <CustomAppForm setIsCustomApp={setIsCustomApp} />
              ) : (
                <AppListForm addCustomApp={addCustomApp} />
              )}
            </Stack>
            <DialogActions>
              <CancelButton onClick={onClose} />
              <Button
                id={ITEM_FORM_CONFIRM_BUTTON_ID}
                type="submit"
                disabled={isSubmitted && !isValid}
              >
                {translateCommon(COMMON.SAVE_BUTTON)}
              </Button>
            </DialogActions>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default AppForm;
