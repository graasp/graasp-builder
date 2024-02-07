import { useOutletContext } from 'react-router-dom';

import Container from '@mui/material/Container';

import { OutletType } from '@/components/pages/item/type';

import CustomizedTagsEdit from '../publish/CustomizedTagsEdit';
import AdminChatSettings from './AdminChatSettings';
import GeolocationPicker from './GeolocationPicker';
import ItemMetadataContent from './ItemMetadataContent';
import ItemSettingsProperties from './ItemSettingsProperties';

const ItemSettings = (): JSX.Element => {
  const { item } = useOutletContext<OutletType>();

  return (
    <Container disableGutters sx={{ mt: 2, mb: 4 }}>
      <ItemMetadataContent />
      <CustomizedTagsEdit item={item} />

      <GeolocationPicker item={item} />

      <ItemSettingsProperties item={item} />

      <AdminChatSettings item={item} />
    </Container>
  );
};

export default ItemSettings;
