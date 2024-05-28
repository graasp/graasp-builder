import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

import { Button, CCSharingVariant, CreativeCommons } from '@graasp/ui';

import { CreativeCommons as CCLicenseIcon } from 'lucide-react';

import { OutletType } from '@/components/pages/item/type';
import { CC_LICENSE_ABOUT_URL } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';
import { convertLicense } from '@/utils/itemLicense';

import ItemSettingProperty from './ItemSettingProperty';
import UpdateLicenseDialog from './UpdateLicenseDialog';

const ItemLicenseSettings = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);

  const { item } = useOutletContext<OutletType>();

  const { allowSharing, allowCommercialUse, requireAccreditation } = useMemo(
    () => convertLicense(item.settings.ccLicenseAdaption ?? ''),
    [item.settings.ccLicenseAdaption],
  );

  return (
    <>
      <ItemSettingProperty
        title={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_TITLE)}
        icon={<CCLicenseIcon />}
        inputSetting={
          <Button variant="outlined" onClick={() => setLicenseDialogOpen(true)}>
            {translateBuilder(BUILDER.UPDATE_LICENSE)}
          </Button>
        }
        valueText={
          <Link to={CC_LICENSE_ABOUT_URL}>
            {translateBuilder(
              BUILDER.ITEM_SETTINGS_CC_LICENSE_MORE_INFORMATIONS,
            )}
          </Link>
        }
        additionalInfo={
          item.settings?.ccLicenseAdaption ? (
            <CreativeCommons
              sx={{
                border: '1px solid #bbb',
                borderRadius: 2,
                backgroundColor: 'white',
              }}
              requireAccreditation={requireAccreditation}
              allowSharedAdaptation={allowSharing as CCSharingVariant}
              allowCommercialUse={allowCommercialUse}
              iconSize={30}
            />
          ) : undefined
        }
      />
      <UpdateLicenseDialog
        open={licenseDialogOpen}
        setOpen={setLicenseDialogOpen}
        item={item}
      />
    </>
  );
};

export default ItemLicenseSettings;
