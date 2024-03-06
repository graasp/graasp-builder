import { Stack } from '@mui/material';

import {
  DescriptionPlacementType,
  DiscriminatedItem,
  ItemType,
} from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

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
