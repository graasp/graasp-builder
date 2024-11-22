import { Stack } from '@mui/material';

import { DescriptionForm, type DescriptionFormProps } from './DescriptionForm';
import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionAndPlacementFormProps = {
  id?: string;
  description?: string;
  onDescriptionChange: DescriptionFormProps['onChange'];
};

export const DescriptionAndPlacementForm = ({
  id,
  description = '',
  onDescriptionChange,
}: DescriptionAndPlacementFormProps): JSX.Element => (
  <Stack spacing={2}>
    <DescriptionForm
      id={id}
      value={description}
      onChange={onDescriptionChange}
    />
    <DescriptionPlacementForm />
  </Stack>
);
