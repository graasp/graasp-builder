import { MenuItem, Select } from '@mui/material';

import {
  DescriptionPlacement,
  DescriptionPlacementType,
  DiscriminatedItem,
} from '@graasp/sdk';

import { CornerDownRightIcon, CornerUpRightIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import {
  ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID,
  buildDescriptionPlacementId,
} from '@/config/selectors';
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
  const descriptionPlacement =
    updatedProperties.settings?.descriptionPlacement ?? DEFAULT_PLACEMENT;

  return (
    <ItemSettingProperty
      title={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_TITLE)}
      icon={
        descriptionPlacement === DescriptionPlacement.ABOVE ? (
          <CornerUpRightIcon />
        ) : (
          <CornerDownRightIcon />
        )
      }
      valueText={t(BUILDER.ITEM_SETTINGS_DESCRIPTION_PLACEMENT_HELPER, {
        placement: t(descriptionPlacement).toLowerCase(),
      })}
      inputSetting={
        <Select
          id={ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}
          value={descriptionPlacement}
          onChange={(e) => handlePlacementChanged(e.target.value)}
          size="small"
        >
          {Object.values(DescriptionPlacement).map((placement) => (
            <MenuItem
              id={buildDescriptionPlacementId(placement)}
              value={placement}
            >
              {t(placement)}
            </MenuItem>
          ))}
        </Select>
      }
    />
  );
};

export default DescriptionPlacementForm;
