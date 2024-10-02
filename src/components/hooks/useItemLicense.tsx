import { useEffect, useState } from 'react';

import { SxProps } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { CCSharingVariant, CreativeCommons } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { convertLicense, convertSelectionToLicense } from '@/utils/itemLicense';

import LicenseForm from '../item/publish/LicenseForm';
import { CCLicenseChoice, CCSharingLicenseChoice } from '../item/publish/type';

const { useEditItem } = mutations;

const licensePreviewStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
};

export type UseItemLicense = {
  handleSubmit: () => void;
  removeLicense: () => void;
  licenseForm: JSX.Element;
  creativeCommons: JSX.Element;
  requireAttributionValue: CCLicenseChoice;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const useItemLicense = ({
  item,
  iconSize,
  disabled,
  commonsSx,
  enableNotifications = true,
}: {
  item: DiscriminatedItem;
  iconSize?: number;
  disabled?: boolean;
  commonsSx?: SxProps;
  enableNotifications?: boolean;
}): UseItemLicense => {
  const [requireAttributionValue, setRequireAttributionValue] =
    useState<CCLicenseChoice>('no');
  const [allowCommercialValue, setAllowCommercialValue] =
    useState<CCLicenseChoice>('yes');
  const [allowSharingValue, setAllowSharingValue] =
    useState<CCSharingLicenseChoice>('yes');

  const {
    mutate: updateItem,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useEditItem({ enableNotifications });

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
      updateItem({
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

  const removeLicense = () =>
    updateItem({ id, settings: { ccLicenseAdaption: null } });

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
      iconSize={iconSize}
    />
  );
  return {
    handleSubmit,
    removeLicense,
    licenseForm,
    creativeCommons,
    requireAttributionValue,
    isError,
    isLoading,
    isSuccess,
  };
};

export default useItemLicense;
