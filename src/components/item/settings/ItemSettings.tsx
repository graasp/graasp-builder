import { useOutletContext } from 'react-router-dom';

import { Stack } from '@mui/material';
import Container from '@mui/material/Container';

import { OutletType } from '@/components/pages/item/type';

import AdminChatSettings from './AdminChatSettings';
import CustomizedTagsSettings from './CustomizedTagsSettings';
import GeolocationPicker from './GeolocationPicker';
import ItemLicenseSettings from './ItemLicenseSettings';
import ItemMetadataContent from './ItemMetadataContent';
import ItemSettingsProperties from './ItemSettingsProperties';
import ThumbnailSetting from './ThumbnailSetting';

const ItemSettings = (): JSX.Element => {
  const { item } = useOutletContext<OutletType>();

  return (
    <Container disableGutters sx={{ mt: 2, mb: 4 }}>
      <Stack gap={4}>
        <ThumbnailSetting item={item} />
        <ItemMetadataContent />
        <CustomizedTagsSettings item={item} />
        <ItemSettingsProperties item={item} />
        <AdminChatSettings item={item} />
        <ItemLicenseSettings />
        <GeolocationPicker item={item} />
      </Stack>
    </Container>
  );
};

export default ItemSettings;
