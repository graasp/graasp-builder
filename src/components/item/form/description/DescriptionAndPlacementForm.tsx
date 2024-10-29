import { Stack } from '@mui/material';

import { DescriptionPlacementType } from '@graasp/sdk';

import DescriptionForm, { DescriptionFormProps } from './DescriptionForm';
import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionAndPlacementFormProps = {
  id?: string;
  description?: string;
  descriptionPlacement?: DescriptionPlacementType;
  showPlacement?: boolean;
  onPlacementChange: (v: DescriptionPlacementType) => void;
  onDescriptionChange: DescriptionFormProps['onChange'];
};

export const DescriptionAndPlacementForm = ({
  id,
  description = '',
  descriptionPlacement,
  showPlacement = true,
  onPlacementChange,
  onDescriptionChange,
}: DescriptionAndPlacementFormProps): JSX.Element => (
  <Stack spacing={2}>
    <DescriptionForm
      id={id}
      value={description}
      onChange={onDescriptionChange}
    />

    {showPlacement && (
      <DescriptionPlacementForm
        descriptionPlacement={descriptionPlacement}
        onPlacementChange={onPlacementChange}
      />
    )}
  </Stack>
);
