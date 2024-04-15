import { CCLicenseAdaptions } from '@graasp/sdk';

import {
  CCLicenseChoice,
  CCSharingLicenseChoice,
} from '@/components/item/publish/type';

interface LicenseOptions {
  requireAttributionValue: CCLicenseChoice;
  allowCommercialValue: CCLicenseChoice;
  allowSharingValue: CCSharingLicenseChoice;
}

export const convertSelectionToLicense = ({
  requireAttributionValue,
  allowCommercialValue,
  allowSharingValue,
}: LicenseOptions): CCLicenseAdaptions => {
  if (requireAttributionValue !== 'yes') {
    return CCLicenseAdaptions.CC0;
  }

  return `CC BY${allowCommercialValue === 'yes' ? '' : '-NC'}${
    allowSharingValue === 'alike' ? '-SA' : ''
  }${allowSharingValue === 'no' ? '-ND' : ''}` as CCLicenseAdaptions;
};

interface AdaptionToLicense {
  requireAccreditation: boolean;
  allowCommercialUse: boolean;
  allowSharing: CCSharingLicenseChoice;
}

export const convertLicense = (
  ccLicenseAdaption: string,
): AdaptionToLicense => {
  // Legacy licenses.
  if (['alike', 'allow'].includes(ccLicenseAdaption)) {
    return {
      requireAccreditation: true,
      allowCommercialUse: true,
      allowSharing: ccLicenseAdaption === 'alike' ? 'alike' : 'yes',
    };
  }

  return {
    requireAccreditation: ccLicenseAdaption?.includes('BY'),
    allowCommercialUse: !ccLicenseAdaption?.includes('NC'),
    allowSharing: (() => {
      if (!ccLicenseAdaption?.length) {
        return '';
      }
      if (ccLicenseAdaption?.includes('SA')) {
        return 'alike';
      }
      return ccLicenseAdaption?.includes('ND') ? 'no' : 'yes';
    })(),
  };
};
