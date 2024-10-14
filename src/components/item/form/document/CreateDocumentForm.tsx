import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Stack } from '@mui/material';

import { DocumentItemExtraFlavor, buildDocumentExtra } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { EditModalContentPropType } from '../../edit/EditModal';
import NameForm from '../NameForm';
import {
  DocumentContentForm,
  DocumentExtraFormInputs,
} from './DocumentContentForm';
import { DocumentFlavorSelect } from './DocumentFlavorSelect';

type Inputs = {
  name: string;
  flavor: DocumentItemExtraFlavor;
} & DocumentExtraFormInputs;

const CreateDocumentForm = ({
  setChanges,
}: EditModalContentPropType): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [isRaw, setIsRaw] = useState(false);
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
  }, [name, isRaw, content, flavor, setChanges]);

  return (
    <Box id="document" display="flex" flexDirection="column" overflow="auto">
      <Stack direction="row" spacing={2}>
        <NameForm
          name={name}
          nameForm={register('name')}
          required
          reset={() => reset({ name: '' })}
        />
      </Stack>
      <DocumentFlavorSelect
        control={control}
        flavorForm={register('flavor', { value: DocumentItemExtraFlavor.None })}
      />
      <DocumentContentForm
        flavor={flavor}
        onChange={(v) => setValue('content', v)}
        setIsRaw={setIsRaw}
        isRaw={isRaw}
        documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
        contentForm={register('content')}
        content={content}
        placeholder={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
      />
    </Box>
  );
};

export default CreateDocumentForm;
