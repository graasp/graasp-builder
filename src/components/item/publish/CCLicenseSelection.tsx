import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { ChangeEvent, FC, useEffect, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { CCSharingVariant, CreativeCommons, Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SHARE_ALIKE_CONTROL_ID,
} from '../../../config/selectors';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CCLicenseDialog from './CCLicenseDialog';

const { EDIT_ITEM } = MUTATION_KEYS;

// TODO: export in graasp sdk
enum CCLicenseAdaptions {
  CC_BY = 'CC BY',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
}

export type CCLicenseAdaption = CCLicenseAdaptions | `${CCLicenseAdaptions}`;

type CCLicenseChoice = 'yes' | 'no' | '';
type CCSharingLicenseChoice = CCLicenseChoice | 'alike';

type Props = {
  item: ItemRecord;
  disabled: boolean;
};

const licensePreviewStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  minWidth: 300,
};

const CCLicenseSelection: FC<Props> = ({ item, disabled }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: updateCCLicense } = useMutation<
    any,
    any,
    {
      id: string;
      name: string;
      settings: { ccLicenseAdaption: CCLicenseAdaption };
    }
  >(EDIT_ITEM);
  const [requireAttributionValue, setRequireAttributionValue] =
    useState<CCLicenseChoice>('');
  const [allowCommercialValue, setAllowCommercialValue] =
    useState<CCLicenseChoice>('');
  const [allowSharingValue, setAllowSharingValue] =
    useState<CCSharingLicenseChoice>('');

  const [open, setOpen] = useState(false);

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  // itemId
  const itemId = item?.id;

  const settings = item?.settings;
  const itemName = item?.name;

  useEffect(() => {
    if (settings?.ccLicenseAdaption) {
      // Handles old license formats.
      if (['alike', 'allow'].includes(settings?.ccLicenseAdaption as CCLicenseAdaption)) {
        setRequireAttributionValue('yes');
        setAllowCommercialValue('no');
        setAllowSharingValue(
          settings?.ccLicenseAdaption === 'alike' ? 'alike' : 'yes',
        );
      } else if (typeof settings?.ccLicenseAdaption === 'string') {
        setRequireAttributionValue(
          settings.ccLicenseAdaption !== CCLicenseAdaptions.CC0 ? 'yes' : 'no',
        );
        setAllowCommercialValue(
          settings.ccLicenseAdaption.includes('NC') ? 'no' : 'yes',
        );
        if (settings.ccLicenseAdaption.includes('SA')) {
          setAllowSharingValue('alike');
        } else if (settings.ccLicenseAdaption.includes('ND')) {
          setAllowSharingValue('no');
        } else {
          setAllowSharingValue('yes');
        }
      }
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const convertSelectionToLicense = (): CCLicenseAdaptions => {
    if (requireAttributionValue !== 'yes') {
      return CCLicenseAdaptions.CC0;
    }

    return `CC BY${allowCommercialValue === 'yes' ? '' : '-NC'}${
      allowSharingValue === 'alike' ? '-SA' : ''
    }${allowSharingValue === 'no' ? '-ND' : ''}` as CCLicenseAdaptions;
  };

  const handleAttributionChange = (event: ChangeEvent<{ value: string }>) => {
    setRequireAttributionValue(event.target.value as CCLicenseChoice);
  };

  const handleCommercialChange = (event: ChangeEvent<{ value: string }>) => {
    setAllowCommercialValue(event.target.value as CCLicenseChoice);
  };

  const handleSharingChange = (event: ChangeEvent<{ value: string }>) => {
    setAllowSharingValue(event.target.value as CCSharingLicenseChoice);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (requireAttributionValue) {
      updateCCLicense({
        id: itemId,
        name: itemName,
        settings: { ccLicenseAdaption: convertSelectionToLicense() },
      });
    } else {
      console.error(`optionValue "${requireAttributionValue}" is undefined`);
    }
    setOpen(false);
  };

  return (
    <Box mx={3}>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
      </Typography>
      <Box mx={3}>
        <RadioGroup
          aria-label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
          name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
          value={requireAttributionValue}
          onChange={handleAttributionChange}
        >
          <FormControlLabel
            id={CC_REQUIRE_ATTRIBUTION_CONTROL_ID}
            value="yes"
            control={<Radio color="primary" />}
            disabled={disabled}
            label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_REQUIRE_ATTRIBUTION_OPTION_LABEL)}
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
                label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ALLOW_COMMERCIAL_OPTION_LABEL)}
              />
              <FormControlLabel
                id={CC_DISALLOW_COMMERCIAL_CONTROL_ID}
                value="no"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_DISALLOW_COMMERCIAL_OPTION_LABEL)}
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
                label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ALLOW_REMIX_OPTION_LABEL)}
              />
              <FormControlLabel
                id={CC_SHARE_ALIKE_CONTROL_ID}
                value="alike"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_ALLOW_SHARE_ALIKE_REMIX_OPTION_LABEL)}
              />
              <FormControlLabel
                id={CC_NO_DERIVATIVE_CONTROL_ID}
                value="no"
                control={<Radio color="primary" />}
                disabled={disabled}
                label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_DISALLOW_REMIX_OPTION_LABEL)}
              />
            </RadioGroup>
          </Box>
        </>
      )}
      <CCLicenseDialog
        disabled={disabled}
        open={open}
        setOpen={setOpen}
        buttonName={translateBuilder(
          BUILDER.ITEM_SETTINGS_CC_LICENSE_SUBMIT_BUTTON,
        )}
        handleSubmit={handleSubmit}
      />
      {settings?.ccLicenseAdaption && (
        <>
          <Typography variant="subtitle1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_PREVIEW_TITLE)}
          </Typography>
          <Box display="flex" justifyContent="left">
            <CreativeCommons
              requireAccreditation={requireAttributionValue === 'yes'}
              allowSharedAdaptation={allowSharingValue as CCSharingVariant}
              allowCommercialUse={allowCommercialValue === 'yes'}
              sx={licensePreviewStyle}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CCLicenseSelection;
