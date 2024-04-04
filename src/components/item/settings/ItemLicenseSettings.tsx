import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Help } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { redirect } from '@graasp/sdk';
import { Button, CCSharingVariant, CreativeCommons } from '@graasp/ui';

import { OutletType } from '@/components/pages/item/type';
import { CC_LICENSE_ABOUT_URL } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';
import { convertLicense } from '@/utils/itemLicense';

import UpdateLicenseDialog from './UpdateLicenseDialog';

const ItemLicenseSettings = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);

  const { item } = useOutletContext<OutletType>();

  const handleClick = () => {
    const url = CC_LICENSE_ABOUT_URL;
    redirect(window, url, { openInNewTab: true });
  };

  const { allowSharing, allowCommercialUse, requireAccreditation } = useMemo(
    () => convertLicense(item.settings.ccLicenseAdaption ?? ''),
    [item.settings.ccLicenseAdaption],
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" display="flex" alignItems="center">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_TITLE)}
            <Tooltip
              title={translateBuilder(
                BUILDER.ITEM_SETTINGS_CC_LICENSE_MORE_INFORMATIONS,
              )}
              arrow
            >
              <span>
                <IconButton aria-label="info" onClick={handleClick}>
                  <Help />
                </IconButton>
              </span>
            </Tooltip>
          </Typography>
          {item.settings?.ccLicenseAdaption && (
            <Box display="flex" justifyContent="left">
              <CreativeCommons
                requireAccreditation={requireAccreditation}
                allowSharedAdaptation={allowSharing as CCSharingVariant}
                allowCommercialUse={allowCommercialUse}
              />
            </Box>
          )}
        </Box>
        <Button variant="outlined" onClick={() => setLicenseDialogOpen(true)}>
          {translateBuilder(BUILDER.UPDATE_LICENSE)}
        </Button>
      </Stack>
      <UpdateLicenseDialog
        open={licenseDialogOpen}
        setOpen={setLicenseDialogOpen}
        item={item}
      />
    </>
  );
};

export default ItemLicenseSettings;
