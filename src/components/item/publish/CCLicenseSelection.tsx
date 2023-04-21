import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

import { ChangeEvent, FC, useEffect, useState } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { CCLicenseIcon, Loader } from '@graasp/ui';

import { CC_LICENSE_ADAPTION_OPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CCLicenseDialog from './CCLicenseDialog';

// TODO: export in graasp sdk
enum CCLicenseAdaption {
  ALLOW = 'allow',
  ALIKE = 'alike',
}

type Props = {
  item: ItemRecord;
  disabled: boolean;
};

const CCLicenseSelection: FC<Props> = ({ item, disabled }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: updateCCLicense } = mutations.useEditItem();
  const [optionValue, setOptionValue] = useState<CCLicenseAdaption>();
  const [open, setOpen] = useState(false);

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  // itemId
  const itemId = item?.id;

  const settings = item?.settings;
  const itemName = item?.name;

  useEffect(() => {
    if (settings?.ccLicenseAdaption) {
      setOptionValue(settings.ccLicenseAdaption as CCLicenseAdaption);
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    setOptionValue(event.target.value as CCLicenseAdaption);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (optionValue) {
      updateCCLicense({
        id: itemId,
        name: itemName,
        settings: { ccLicenseAdaption: optionValue },
      });
    } else {
      console.error(`optionValue "${optionValue}" is undefined`);
    }
    setOpen(false);
  };

  return (
    <>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_INFORMATIONS)}
      </Typography>
      <RadioGroup
        aria-label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL)}
        name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL)}
        value={optionValue}
        onChange={handleChange}
      >
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.ALLOW}
          control={<Radio color="primary" />}
          disabled={disabled}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_ALLOW_LABEL)}
        />
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.ALIKE}
          control={<Radio color="primary" />}
          disabled={disabled}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_ALIKE_LABEL)}
        />
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.NONE}
          control={<Radio color="primary" />}
          disabled={disabled}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_NONE_LABEL)}
        />
      </RadioGroup>
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
          <CCLicenseIcon
            adaption={settings?.ccLicenseAdaption as CCLicenseAdaption}
            sx={{ mt: 1 }}
          />
        </>
      )}
    </>
  );
};

export default CCLicenseSelection;
