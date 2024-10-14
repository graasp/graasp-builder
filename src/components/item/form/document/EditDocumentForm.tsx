import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Stack } from '@mui/material';

import {
  DocumentItemExtraFlavor,
  DocumentItemType,
  ItemType,
  buildDocumentExtra,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import type { EditModalContentPropType } from '../../edit/EditModal';
import NameForm from '../NameForm';
import {
  DocumentContentForm,
  DocumentExtraFormInputs,
} from './DocumentContentForm';
import { DocumentFlavorSelect } from './DocumentFlavorSelect';

type Inputs = {
  name: string;
  flavor: `${DocumentItemExtraFlavor}`;
} & DocumentExtraFormInputs;

const EditDocumentForm = ({
  setChanges,
  item,
}: {
  setChanges: EditModalContentPropType['setChanges'];
  item: DocumentItemType;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [isRaw, setIsRaw] = useState(
    item?.extra?.[ItemType.DOCUMENT]?.isRaw ?? false,
  );

  const { register, watch, control, setValue, reset } = useForm<Inputs>();
  const name = watch('name');
  const content = watch('content');
  const flavor = watch('flavor');

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      name,
      extra: buildDocumentExtra({ content, flavor, isRaw }),
    });
  }, [content, flavor, isRaw, name, setChanges]);

  return (
    <Box id="document" display="flex" flexDirection="column" overflow="auto">
      <Stack direction="row" spacing={2}>
        <NameForm
          name={name}
          nameForm={register('name', { value: item.name })}
          required
          reset={() => reset({ name: '' })}
        />
      </Stack>
      <DocumentFlavorSelect
        control={control}
        flavorForm={register('flavor', {
          value: item?.extra?.[ItemType.DOCUMENT]?.flavor,
        })}
      />
      <DocumentContentForm
        documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
        flavor={flavor}
        onChange={(v) => setValue('content', v)}
        setIsRaw={setIsRaw}
        isRaw={isRaw}
        content={content}
        contentForm={register('content', {
          value: item?.extra?.[ItemType.DOCUMENT]?.content || '',
        })}
        placeholder={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
      />
    </Box>
  );
};

export default EditDocumentForm;
