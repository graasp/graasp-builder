import { ChangeEvent, useEffect, useState } from 'react';

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { CCLicenseAdaptions, DiscriminatedItem } from '@graasp/sdk';
import { CCSharingVariant, CreativeCommons, Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SHARE_ALIKE_CONTROL_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CCLicenseDialog from './CCLicenseDialog';

type CCLicenseChoice = 'yes' | 'no' | '';
type CCSharingLicenseChoice = CCLicenseChoice | 'alike';

type Props = {
  item: DiscriminatedItem;
  disabled: boolean;
  confirmSubmitInNewDialog?: boolean;
  setConfirmationStep?: (b: boolean) => void;
  confirmationStep?: boolean;
  onSubmit?: () => void;
};

const licensePreviewStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  minWidth: 300,
};

const CCLicenseSelection = ({
  item,
  disabled,
  confirmSubmitInNewDialog = true,
  setConfirmationStep,
  confirmationStep,
  onSubmit,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: updateCCLicense } = mutations.useEditItem();

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
      if (['alike', 'allow'].includes(settings?.ccLicenseAdaption)) {
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

  const handleSubmit = () => {
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
    onSubmit?.();
  };

  const alignLicenseToCenter = !confirmSubmitInNewDialog;

  return (
    <Box mx={3}>
      {!confirmationStep && (
        <>
          <Typography variant="body1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE)}
          </Typography>
          <Box mx={3}>
            <RadioGroup
              aria-label={translateBuilder(
                BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE,
              )}
              name={translateBuilder(
                BUILDER.ITEM_SETTINGS_CC_ATTRIBUTION_TITLE,
              )}
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
                label={translateBuilder(
                  BUILDER.ITEM_SETTINGS_CC_CC0_OPTION_LABEL,
                )}
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
                  name={translateBuilder(
                    BUILDER.ITEM_SETTINGS_CC_COMMERCIAL_TITLE,
                  )}
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
                  name={translateBuilder(
                    BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL,
                  )}
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
      )}

      {confirmSubmitInNewDialog && (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          disabled={disabled || !requireAttributionValue} // disable the button if no option is selected
        >
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_SUBMIT_BUTTON)}
        </Button>
      )}
      <CCLicenseDialog
        open={open}
        setOpen={setOpen}
        handleBack={() => setConfirmationStep?.(false)}
        isNewDialog={!confirmationStep}
        handleSubmit={handleSubmit}
        disableSubmission={!requireAttributionValue}
      />

      {settings?.ccLicenseAdaption && !confirmationStep && (
        <>
          <Typography
            variant="subtitle1"
            mt={2}
            textAlign={alignLicenseToCenter ? 'center' : 'left'}
          >
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_PREVIEW_TITLE)}
          </Typography>
          <Box
            display="flex"
            justifyContent={alignLicenseToCenter ? 'center' : 'left'}
          >
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
