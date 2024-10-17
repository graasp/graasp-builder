import { Box, FormLabel, Stack, Typography } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionFormProps = {
  id?: string;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
  description?: string;
  descriptionPlacement?: DescriptionPlacementType;
  showPlacement?: boolean;
};

const DescriptionForm = ({
  id,
  description,
  descriptionPlacement,
  setChanges,
  showPlacement = true,
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
      <Box>
        <FormLabel>
          <Typography variant="caption">
            {translateBuilder(BUILDER.DESCRIPTION_LABEL)}
          </Typography>
        </FormLabel>
        <TextEditor
          id={id}
          value={description ?? ''}
          onChange={onChange}
          showActions={false}
        />
      </Box>

      {showPlacement && (
        <DescriptionPlacementForm
          updatedProperties={{ settings: { descriptionPlacement } }}
          onPlacementChanged={onPlacementChanged}
        />
      )}
    </Stack>
  );
};

export default DescriptionForm;
