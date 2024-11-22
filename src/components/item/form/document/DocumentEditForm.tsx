import { FormProvider, useForm } from 'react-hook-form';

import { Box, DialogActions, DialogContent } from '@mui/material';

import {
  DocumentItemExtraFlavor,
  DocumentItemType,
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
  item: DocumentItemType;
};

type Inputs = {
  name: string;
  flavor: `${DocumentItemExtraFlavor}`;
  isRaw: boolean;
} & DocumentExtraFormInputs;

export function DocumentEditForm({ item, onClose }: Props): JSX.Element {
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: editItem } = mutations.useEditItem();

  const methods = useForm<Inputs>({
    defaultValues: {
      name: item?.name,
      flavor:
        item?.extra?.[ItemType.DOCUMENT]?.flavor ??
        DocumentItemExtraFlavor.None,
      content: item?.extra?.[ItemType.DOCUMENT]?.content || '',
      isRaw: item?.extra?.[ItemType.DOCUMENT]?.isRaw ?? false,
    },
  });
  const {
    setValue,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
        extra: buildDocumentExtra({
          content: data.content,
          flavor: data.flavor,
          isRaw: data.isRaw,
        }),
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box component="form" height="100%" onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <DialogContent>
          <ItemNameField required />
          <DocumentFlavorSelect />
          <DocumentContentForm
            documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
            onChange={(v) => setValue('content', v)}
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
