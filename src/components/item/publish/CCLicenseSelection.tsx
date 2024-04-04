import { useState } from 'react';

import { Box, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CCLicenseDialog from './CCLicenseDialog';
import useItemLicense from './useItemLicense';

type Props = {
  item: DiscriminatedItem;
  disabled: boolean;
};

const CCLicenseSelection = ({ item, disabled }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { handleSubmit, licenseForm, creativeCommons } = useItemLicense({
    item,
  });

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  const [open, setOpen] = useState(false);

  const settings = item?.settings;

  if (isMemberLoading) return <Loader />;

  const onSubmit = () => {
    handleSubmit();
    setOpen(false);
  };
  return (
    <Box mx={3}>
      {licenseForm}
      <CCLicenseDialog
        disabled={disabled}
        open={open}
        setOpen={setOpen}
        buttonName={translateBuilder(
          BUILDER.ITEM_SETTINGS_CC_LICENSE_SUBMIT_BUTTON,
        )}
        handleSubmit={onSubmit}
      />
      {settings?.ccLicenseAdaption && (
        <>
          <Typography variant="subtitle1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_PREVIEW_TITLE)}
          </Typography>
          <Box display="flex" justifyContent="left">
            {creativeCommons}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CCLicenseSelection;
