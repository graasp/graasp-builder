import { useOutletContext } from 'react-router-dom';

import { Box, Container, Divider, Stack, Typography } from '@mui/material';

import { OutletType } from '@/components/pages/item/type';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import VisibilitySelect from './VisibilitySelect';
import MembershipTabs from './membershipTable/MembershipTabs';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

const ItemSharingTab = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();

  const { data: memberships } = hooks.useItemMemberships(item?.id);

  return (
    <Container disableGutters component="div">
      <Stack gap={2} mb={5}>
        <Box>
          <Typography variant="h5">
            {translateBuilder(BUILDER.SHARING_TITLE)}
          </Typography>
          <ShortLinksRenderer
            itemId={item.id}
            canAdminShortLink={Boolean(memberships && canAdmin)}
          />
        </Box>
        <Divider />
        <Box>
          <Typography variant="h6">
            {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
          </Typography>
          <VisibilitySelect item={item} edit={canAdmin} />
        </Box>
        <Divider />
        <MembershipTabs />
      </Stack>
    </Container>
  );
};

export default ItemSharingTab;
