import { Stack, Typography } from '@mui/material';

import {
  DescriptionPlacementType,
  DiscriminatedItem,
  ItemType,
} from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionFormProps = {
  id?: string;
  item?: DiscriminatedItem;
  updatedProperties: Partial<DiscriminatedItem>;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
};

const DescriptionForm = ({
  id,
  updatedProperties,
  item,
  setChanges,
}: DescriptionFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const onChange = (content: string): void => {
    setChanges({
      description: content,
    });
  };

  const onPlacementChanged = (placement: DescriptionPlacementType): void => {
    setChanges({
      settings: {
        descriptionPlacement: placement,
      },
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2">
        {translateBuilder(BUILDER.DESCRIPTION_LABEL)}
      </Typography>
      <TextEditor
        id={id}
        value={(updatedProperties?.description || item?.description) ?? ''}
        onChange={onChange}
        showActions={false}
      />

      {updatedProperties.type !== ItemType.FOLDER && (
        <DescriptionPlacementForm
          updatedProperties={updatedProperties}
          onPlacementChanged={onPlacementChanged}
        />
      )}
    </Stack>
  );
};

export default DescriptionForm;
