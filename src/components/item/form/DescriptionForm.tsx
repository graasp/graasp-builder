import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';

import {
  DescriptionPlacement,
  DescriptionPlacementType,
  DiscriminatedItem,
} from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

const DEFAULT_PLACEMENT = DescriptionPlacement.BELOW;

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

  const onPlacementChanged = (placement: string): void => {
    setChanges({
      settings: {
        descriptionPlacement: placement as DescriptionPlacementType,
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
      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <InputLabel id="description-placement-label">
          {t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_LABEL)}
        </InputLabel>
        <Select
          labelId="description-placement-label"
          value={
            updatedProperties.settings?.descriptionPlacement ??
            DEFAULT_PLACEMENT
          }
          label={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_LABEL)}
          onChange={(e) => onPlacementChanged(e.target.value)}
        >
          <MenuItem value={DescriptionPlacement.ABOVE}>
            {t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_ABOVE)}
          </MenuItem>
          <MenuItem value={DescriptionPlacement.BELOW}>
            {t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_BELOW)}
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default DescriptionForm;
