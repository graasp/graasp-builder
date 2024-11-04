import { Box, FormLabel, Typography } from '@mui/material';

import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

export type DescriptionFormProps = {
  id?: string;
  value?: string;
  onChange: (v: string) => void;
};

export function DescriptionForm({
  id,
  value = '',
  onChange,
}: DescriptionFormProps): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Box>
      <FormLabel>
        <Typography variant="caption">
          {translateBuilder(BUILDER.DESCRIPTION_LABEL)}
        </Typography>
      </FormLabel>
      <TextEditor
        id={id}
        value={value}
        onChange={onChange}
        showActions={false}
      />
    </Box>
  );
}
