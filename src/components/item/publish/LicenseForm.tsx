import { ChangeEvent } from 'react';

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import {
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SHARE_ALIKE_CONTROL_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { CCLicenseChoice, CCSharingLicenseChoice } from './type';

interface Props {
  setRequireAttributionValue: (s: CCLicenseChoice) => void;
  requireAttributionValue: CCLicenseChoice;
  setAllowCommercialValue: (s: CCLicenseChoice) => void;
  setAllowSharingValue: (s: CCSharingLicenseChoice) => void;
  allowCommercialValue: CCLicenseChoice;
  allowSharingValue: CCSharingLicenseChoice;
  disabled?: boolean;
}

const LicenseForm = ({
  setRequireAttributionValue,
  requireAttributionValue,
  setAllowCommercialValue,
  setAllowSharingValue,
  allowCommercialValue,
  allowSharingValue,
  disabled,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleAttributionChange = (event: ChangeEvent<{ value: string }>) => {
    setRequireAttributionValue(event.target.value as CCLicenseChoice);
  };

  const handleCommercialChange = (event: ChangeEvent<{ value: string }>) => {
    setAllowCommercialValue(event.target.value as CCLicenseChoice);
  };

  const handleSharingChange = (event: ChangeEvent<{ value: string }>) => {
    setAllowSharingValue(event.target.value as CCSharingLicenseChoice);
  };

  return (
    <>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
      </Typography>

      <Box mx={3}>
        <RadioGroup
          aria-label={translateBuilder(
            BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE,
          )}
          name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
          value={requireAttributionValue}
          onChange={handleAttributionChange}
        >
          <FormControlLabel
            id={CC_REQUIRE_ATTRIBUTION_CONTROL_ID}
            value="yes"
            control={<Radio color="primary" />}
            disabled={disabled}
            label={translateBuilder(
              BUILDER.ITEM_SETTINGS_CC_REQUIRE_ATTRIBUTION_OPTION_LABEL,
            )}
          />
          <FormControlLabel
            id={CC_CC0_CONTROL_ID}
            value="no"
            control={<Radio color="primary" />}
            disabled={disabled}
            label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_CC0_OPTION_LABEL)}
          />
        </RadioGroup>
      </Box>
      {requireAttributionValue === 'yes' && (
        <>
          <Typography variant="body1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_COMMERCIAL_TITLE)}
          </Typography>
          <Box mx={3}>
            <RadioGroup
              aria-label={translateBuilder(
                BUILDER.ITEM_SETTINGS_CC_COMMERCIAL_TITLE,
              )}
              name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_COMMERCIAL_TITLE)}
              value={allowCommercialValue}
              onChange={handleCommercialChange}
            >
              <FormControlLabel
                id={CC_ALLOW_COMMERCIAL_CONTROL_ID}
                value="yes"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_ALLOW_COMMERCIAL_OPTION_LABEL,
                )}
              />
              <FormControlLabel
                id={CC_DISALLOW_COMMERCIAL_CONTROL_ID}
                value="no"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_DISALLOW_COMMERCIAL_OPTION_LABEL,
                )}
              />
            </RadioGroup>
          </Box>
          <Typography variant="body1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_REMIX_TITLE)}
          </Typography>
          <Box mx={3}>
            <RadioGroup
              aria-label={translateBuilder(
                BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL,
              )}
              name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL)}
              value={allowSharingValue}
              onChange={handleSharingChange}
            >
              <FormControlLabel
                id={CC_DERIVATIVE_CONTROL_ID}
                value="yes"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_ALLOW_REMIX_OPTION_LABEL,
                )}
              />
              <FormControlLabel
                id={CC_SHARE_ALIKE_CONTROL_ID}
                value="alike"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_ALLOW_SHARE_ALIKE_REMIX_OPTION_LABEL,
                )}
              />
              <FormControlLabel
                id={CC_NO_DERIVATIVE_CONTROL_ID}
                value="no"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_DISALLOW_REMIX_OPTION_LABEL,
                )}
              />
            </RadioGroup>
          </Box>
        </>
      )}
    </>
  );
};
export default LicenseForm;
