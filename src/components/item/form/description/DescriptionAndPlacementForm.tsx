import { Stack } from '@mui/material';

import { DescriptionPlacementType } from '@graasp/sdk';

import DescriptionForm, { DescriptionFormProps } from './DescriptionForm';
import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionAndPlacementFormProps = {
  id?: string;
  description?: string;
  descriptionPlacement?: DescriptionPlacementType;
  onPlacementChange: (v: DescriptionPlacementType) => void;
  onDescriptionChange: DescriptionFormProps['onChange'];
};

export const DescriptionAndPlacementForm = ({
  id,
  description = '',
  descriptionPlacement,
  onPlacementChange,
  onDescriptionChange,
}: DescriptionAndPlacementFormProps): JSX.Element => (
  <Stack spacing={2}>
    <DescriptionForm
      id={id}
      value={description}
      onChange={onDescriptionChange}
    />
    <DescriptionPlacementForm
      descriptionPlacement={descriptionPlacement}
      onPlacementChange={onPlacementChange}
    />
  </Stack>
);
