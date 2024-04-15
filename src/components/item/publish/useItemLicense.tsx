import React, { useEffect, useState } from 'react';

import { SxProps } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { CCSharingVariant, CreativeCommons } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { convertLicense, convertSelectionToLicense } from '@/utils/itemLicense';

import LicenseForm from './LicenseForm';
import { CCLicenseChoice, CCSharingLicenseChoice } from './type';

const licensePreviewStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  minWidth: 300,
};

const useItemLicense = ({
  item,
  disabled,
  commonsSx,
}: {
  item: DiscriminatedItem;
  disabled?: boolean;
  commonsSx?: SxProps;
}): {
  handleSubmit: () => void;
  licenseForm: JSX.Element;
  creativeCommons: JSX.Element;
  requireAttributionValue: CCLicenseChoice;
} => {
  const [requireAttributionValue, setRequireAttributionValue] =
    useState<CCLicenseChoice>('');
  const [allowCommercialValue, setAllowCommercialValue] =
    useState<CCLicenseChoice>('');
  const [allowSharingValue, setAllowSharingValue] =
    useState<CCSharingLicenseChoice>('');

  const { mutate: updateCCLicense } = mutations.useEditItem();

  const { id, settings } = item;

  useEffect(() => {
    if (settings?.ccLicenseAdaption) {
      const { allowCommercialUse, allowSharing, requireAccreditation } =
        convertLicense(settings.ccLicenseAdaption);
      setAllowSharingValue(allowSharing);
      setAllowCommercialValue(allowCommercialUse ? 'yes' : 'no');
      setRequireAttributionValue(requireAccreditation ? 'yes' : 'no');
    }
  }, [settings]);

  const handleSubmit = () => {
    if (requireAttributionValue) {
      updateCCLicense({
        id,
        settings: {
          ccLicenseAdaption: convertSelectionToLicense({
            allowCommercialValue,
            allowSharingValue,
            requireAttributionValue,
          }),
        },
      });
    } else {
      console.error(`optionValue "${requireAttributionValue}" is undefined`);
    }
  };

  const licenseForm = (
    <LicenseForm
      requireAttributionValue={requireAttributionValue}
      setRequireAttributionValue={setRequireAttributionValue}
      allowCommercialValue={allowCommercialValue}
      allowSharingValue={allowSharingValue}
      setAllowCommercialValue={setAllowCommercialValue}
      setAllowSharingValue={setAllowSharingValue}
      disabled={disabled}
    />
  );

  const creativeCommons = (
    <CreativeCommons
      requireAccreditation={requireAttributionValue === 'yes'}
      allowSharedAdaptation={allowSharingValue as CCSharingVariant}
      allowCommercialUse={allowCommercialValue === 'yes'}
      sx={commonsSx || licensePreviewStyle}
    />
  );
  return {
    handleSubmit,
    licenseForm,
    creativeCommons,
    requireAttributionValue,
  };
};

export default useItemLicense;
