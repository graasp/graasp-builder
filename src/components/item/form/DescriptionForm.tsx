import { Checkbox, FormControlLabel, Stack } from '@mui/material';

import { DescriptionPlacement, DiscriminatedItem } from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

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
  const { t } = useBuilderTranslation();

  const onChange = (content: string): void => {
    setChanges({
      description: content,
    });
  };

  const onCheckBoxChanged = (checked: boolean): void => {
    setChanges({
      settings: {
        descriptionPlacement: checked
          ? DescriptionPlacement.ABOVE
          : DescriptionPlacement.BELOW,
      },
    });
  };

  return (
    <Stack>
      <TextEditor
        id={id}
        value={(updatedProperties?.description || item?.description) ?? ''}
        onChange={onChange}
        showActions={false}
      />
      <FormControlLabel
        // This prevent the switch bleads out
        sx={{ maxWidth: 'max-content' }}
        control={
          <Checkbox
            checked={
              updatedProperties?.settings?.descriptionPlacement ===
              DescriptionPlacement.ABOVE
            }
            onChange={(_, checked: boolean) => onCheckBoxChanged(checked)}
          />
        }
        label={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_ABOVE)}
      />
    </Stack>
  );
};

export default DescriptionForm;
