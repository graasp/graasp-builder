import { useOutletContext } from 'react-router-dom';

import { Box, Container, Stack, Typography } from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { OutletType } from '@/components/pages/item/type';
import { selectHighestMemberships } from '@/utils/membership';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import InvitationsTable from './InvitationsTable';
import ItemLoginMembershipsTable from './ItemLoginMembershipsTable';
import ItemMembershipsTable from './ItemMembershipsTable';
import VisibilitySelect from './VisibilitySelect';
import ImportUsersWithCSVButton from './csvImport/ImportUsersWithCSVButton';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

const MembershipSettings = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canWrite, canAdmin } = useOutletContext<OutletType>();

  const { data: rawMemberships } = hooks.useItemMemberships(item?.id);

  const { data: invitations } = hooks.useItemInvitations(item?.id);

  // do not display settings if cannot access memberships
  if (!rawMemberships || !canWrite) {
    return null;
  }

  const memberships = selectHighestMemberships(rawMemberships)
    .filter((m) => m.account.type === AccountType.Individual)
    .sort((im1, im2) => {
      if (im1.account.type !== AccountType.Individual) {
        return 1;
      }
      if (im2.account.type !== AccountType.Individual) {
        return -1;
      }
      return im1.account.email > im2.account.email ? 1 : -1;
    });

  return (
    <Stack gap={2}>
      {canAdmin && (
        <>
          <CreateItemMembershipForm item={item} memberships={memberships} />
          <ImportUsersWithCSVButton item={item} />
        </>
      )}
      <Box>
        <Typography variant="h6">
          {translateBuilder(BUILDER.SHARING_AUTHORIZED_MEMBERS_TITLE)}
        </Typography>
        <ItemMembershipsTable
          item={item}
          emptyMessage={translateBuilder(
            BUILDER.SHARING_AUTHORIZED_MEMBERS_EMPTY_MESSAGE,
          )}
          memberships={memberships}
          readOnly={!canAdmin}
        />
      </Box>
      <ItemLoginMembershipsTable item={item} />
      <Box>
        <Typography variant="h6">
          {translateBuilder(BUILDER.SHARING_INVITATIONS_TITLE)}
        </Typography>
        <InvitationsTable
          item={item}
          invitations={invitations}
          emptyMessage={translateBuilder(
            BUILDER.SHARING_INVITATIONS_EMPTY_MESSAGE,
          )}
          readOnly={!canAdmin}
        />
      </Box>
    </Stack>
  );
};

const ItemSharingTab = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();

  const { data: memberships } = hooks.useItemMemberships(item?.id);

  return (
    <Container disableGutters component="div">
      <Stack gap={2}>
        <Box>
          <Typography variant="h5">
            {translateBuilder(BUILDER.SHARING_TITLE)}
          </Typography>
          <ShortLinksRenderer
            itemId={item.id}
            canAdminShortLink={Boolean(memberships && canAdmin)}
          />
        </Box>
        <Box>
          <Typography variant="h6">
            {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
          </Typography>
          <VisibilitySelect item={item} edit={canAdmin} />
        </Box>
        <MembershipSettings />
      </Stack>
    </Container>
  );
};

export default ItemSharingTab;
