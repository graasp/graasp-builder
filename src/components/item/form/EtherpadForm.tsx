import { FormProvider, useForm } from 'react-hook-form';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { mutations } from '@/config/queryClient';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../config/i18n';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { ItemNameField } from './ItemNameField';

type Inputs = { name: string };

export function EtherpadForm({
  parentId,
  onClose,
}: {
  parentId?: DiscriminatedItem['id'];
  onClose: () => void;
}): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: postEtherpad } = mutations.usePostEtherpad();
  const { t: translateCommon } = useCommonTranslation();

  const methods = useForm<Inputs>();
  const {
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = methods;
  const onSubmit = async (data: Inputs) => {
    await postEtherpad({ parentId, name: data.name });

    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_TITLE)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_INFORMATIONS)}
          </Typography>
          <ItemNameField required />
        </DialogContent>
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
      </Box>
    </FormProvider>
  );
}
