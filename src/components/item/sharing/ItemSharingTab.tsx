import { useOutletContext } from 'react-router-dom';

import {
  Alert,
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { OutletType } from '@/components/pages/item/type';
import { VISIBILITY_HIDDEN_ALERT_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import DeleteItemLoginSchemaButton from './DeleteItemLoginSchemaButton';
import HideSettingCheckbox from './HideSettingCheckbox';
import VisibilitySelect from './VisibilitySelect';
import MembershipTabs from './membershipTable/MembershipTabs';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

const ItemSharingTab = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();

  const { data: currentAccount } = hooks.useCurrentMember();
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
        {currentAccount?.type === AccountType.Individual ? (
          <>
            <Stack gap={2}>
              <Typography variant="h6">
                {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
              </Typography>
              <DeleteItemLoginSchemaButton itemId={item.id} />
              {item.hidden ? (
                <Alert
                  id={VISIBILITY_HIDDEN_ALERT_ID}
                  sx={{ my: 1 }}
                  severity="info"
                >
                  {translateBuilder(
                    BUILDER.ITEM_SETTINGS_VISIBILITY_HIDDEN_INFORMATION,
                  )}
                </Alert>
              ) : (
                <VisibilitySelect item={item} edit={canAdmin} />
              )}
              <HideSettingCheckbox item={item} />
            </Stack>
            <Divider />
          </>
        ) : null}
        <MembershipTabs />
      </Stack>
    </Container>
  );
};

export default ItemSharingTab;
