import { Box, FormLabel, Stack, Typography } from '@mui/material';

import { DescriptionPlacementType } from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionFormProps = {
  id?: string;
  description?: string;
  descriptionPlacement?: DescriptionPlacementType;
  showPlacement?: boolean;
  onPlacementChange: (v: DescriptionPlacementType) => void;
  onDescriptionChange: (v: string) => void;
};

const DescriptionForm = ({
  id,
  description = '',
  descriptionPlacement,
  showPlacement = true,
  onPlacementChange,
  onDescriptionChange,
}: DescriptionFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Stack spacing={2}>
      <Box>
        <FormLabel>
          <Typography variant="caption">
            {translateBuilder(BUILDER.DESCRIPTION_LABEL)}
          </Typography>
        </FormLabel>
        <TextEditor
          id={id}
          value={description}
          onChange={onDescriptionChange}
          showActions={false}
        />
      </Box>

      {showPlacement && (
        <DescriptionPlacementForm
          descriptionPlacement={descriptionPlacement}
          onPlacementChange={onPlacementChange}
        />
      )}
    </Stack>
  );
};

export default DescriptionForm;
