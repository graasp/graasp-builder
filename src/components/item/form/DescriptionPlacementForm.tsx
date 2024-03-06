import { MenuItem, Select } from '@mui/material';

import {
  DescriptionPlacement,
  DescriptionPlacementType,
  DiscriminatedItem,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import ItemSettingProperty from '../settings/ItemSettingProperty';

const DEFAULT_PLACEMENT = DescriptionPlacement.BELOW;

type DescriptionPlacementFormProps = {
  updatedProperties: Partial<DiscriminatedItem>;
  onPlacementChanged: (payload: DescriptionPlacementType) => void;
};

const DescriptionPlacementForm = ({
  updatedProperties,
  onPlacementChanged,
}: DescriptionPlacementFormProps): JSX.Element | null => {
  const { t } = useBuilderTranslation();

  const handlePlacementChanged = (placement: string): void => {
    onPlacementChanged(placement as DescriptionPlacementType);
  };

  return (
    <ItemSettingProperty
      title={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_TITLE)}
      valueText={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_TEXT)}
      inputSetting={
        <Select
          value={
            updatedProperties.settings?.descriptionPlacement ??
            DEFAULT_PLACEMENT
          }
          onChange={(e) => handlePlacementChanged(e.target.value)}
          size="small"
        >
          <MenuItem value={DescriptionPlacement.ABOVE}>
            {t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_ABOVE)}
          </MenuItem>
          <MenuItem value={DescriptionPlacement.BELOW}>
            {t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_BELOW)}
          </MenuItem>
        </Select>
      }
    />
  );
};

export default DescriptionPlacementForm;
