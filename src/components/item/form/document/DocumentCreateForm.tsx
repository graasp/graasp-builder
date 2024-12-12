import { FormProvider, useForm } from 'react-hook-form';

import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import {
  DiscriminatedItem,
  DocumentItemExtraFlavor,
  ItemGeolocation,
  ItemType,
  buildDocumentExtra,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DOCUMENT_TEXT_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { ItemNameField } from '../ItemNameField';
import {
  DocumentContentForm,
  DocumentExtraFormInputs,
} from './DocumentContentForm';
import { DocumentFlavorSelect } from './DocumentFlavorSelect';

type Props = {
  onClose: () => void;
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

type Inputs = {
  name: string;
  isRaw: boolean;
  flavor: `${DocumentItemExtraFlavor}`;
} & DocumentExtraFormInputs;

export function DocumentCreateForm({
  parentId,
  geolocation,
  previousItemId,
  onClose,
}: Props): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { mutateAsync: createItem } = mutations.usePostItem();

  const methods = useForm<Inputs>({
    defaultValues: { flavor: DocumentItemExtraFlavor.None },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isValid, isSubmitted },
  } = methods;

  async function onSubmit(data: Inputs) {
    try {
      await createItem({
        type: ItemType.DOCUMENT,
        name: data.name,
        extra: buildDocumentExtra({
          content: data.content,
          flavor: data.flavor,
          isRaw: data.isRaw,
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

  return (
    <Box component="form" height="100%" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {translateBuilder(BUILDER.CREATE_NEW_ITEM_DOCUMENT_TITLE)}
      </DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <ItemNameField required />
          <DocumentFlavorSelect />
          <DocumentContentForm
            documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
            onChange={(v) => {
              setValue('content', v);
            }}
            placeholder={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
          />
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
      </FormProvider>
    </Box>
  );
}
