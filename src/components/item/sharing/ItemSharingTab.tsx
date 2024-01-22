import { Divider } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  DiscriminatedItem,
  ItemMembership,
  PermissionLevelCompare,
  isPseudonymizedMember,
} from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import partition from 'lodash.partition';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import {
  isItemAdminAllowedForMember,
  isItemUpdateAllowedForUser,
  isSettingsEditionAllowedForUser,
} from '../../../utils/membership';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import CsvInputParser from './CsvInputParser';
import InvitationsTable from './InvitationsTable';
import ItemMembershipsTable from './ItemMembershipsTable';
import VisibilitySelect from './VisibilitySelect';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

type Props = {
  item: DiscriminatedItem;
  memberships?: ItemMembership[];
};
interface PermissionMap {
  [key: string]: ItemMembership;
}

const selectHighestMemberships = (
  memberships: ItemMembership[],
): ItemMembership[] => {
  const permissionMap = memberships.reduce<PermissionMap>((acc, curr) => {
    const { member, permission } = curr;

    if (
      !acc[member.id] ||
      PermissionLevelCompare.gt(permission, acc[member.id].permission)
    ) {
      acc[member.id] = curr;
    }
    return acc;
  }, {});

  return Object.values(permissionMap);
};

const ItemSharingTab = ({ item, memberships }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentUserContext();
  const { data: invitations } = hooks.useItemInvitations(item?.id);
  const { data: itemLoginSchema, isLoading: isItemLoginLoading } =
    hooks.useItemLoginSchema({ itemId: item.id });

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  const canEditSettings = isSettingsEditionAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  const canAdminShortLinks = isItemAdminAllowedForMember({
    memberships,
    memberId: currentMember?.id,
    itemPath: item.path,
  });

  if (isLoadingCurrentMember && isItemLoginLoading) {
    return <Loader />;
  }

  const renderMembershipSettings = () => {
    // do not display settings if cannot access memberships
    if (!memberships || !canEdit) {
      return null;
    }
    const [authenticatedMemberships, authorizedMemberships] = partition(
      memberships,
      ({ member }) => member?.email && isPseudonymizedMember(member.email),
    );

    return (
      <>
        <Divider sx={{ my: 3 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" m={0} p={0}>
            {translateBuilder(BUILDER.SHARING_AUTHORIZED_MEMBERS_TITLE)}
          </Typography>
          {canEditSettings && <CsvInputParser item={item} />}
        </Grid>
        {canEditSettings && (
          <CreateItemMembershipForm item={item} memberships={memberships} />
        )}
        <ItemMembershipsTable
          item={item}
          emptyMessage={translateBuilder(
            BUILDER.SHARING_AUTHORIZED_MEMBERS_EMPTY_MESSAGE,
          )}
          memberships={selectHighestMemberships(authorizedMemberships)}
          readOnly={!canEditSettings}
        />

        {/* show authenticated members if login schema is defined
        todo: show only if item is pseudomized
        */}
        {itemLoginSchema && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" m={0} p={0}>
              {translateBuilder(BUILDER.SHARING_AUTHENTICATED_MEMBERS_TITLE)}
            </Typography>
            <ItemMembershipsTable
              item={item}
              memberships={selectHighestMemberships(authenticatedMemberships)}
              emptyMessage={translateBuilder(
                BUILDER.SHARING_AUTHENTICATED_MEMBERS_EMPTY_MESSAGE,
              )}
              showEmail={false}
              readOnly={!canEditSettings}
            />
          </>
        )}

        {invitations && Boolean(invitations?.length) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5">
              {translateBuilder(BUILDER.SHARING_INVITATIONS_TITLE)}
            </Typography>
            <InvitationsTable
              item={item}
              invitations={invitations}
              emptyMessage={translateBuilder(
                BUILDER.SHARING_INVITATIONS_EMPTY_MESSAGE,
              )}
              readOnly={!canEditSettings}
            />
            <Divider sx={{ my: 3 }} />
          </>
        )}
      </>
    );
  };

  return (
    <Container disableGutters component="div">
      <Typography variant="h4">
        {translateBuilder(BUILDER.SHARING_TITLE)}
      </Typography>
      <ShortLinksRenderer
        itemId={item.id}
        canAdminShortLink={Boolean(memberships && canAdminShortLinks)}
      />
      <Typography variant="h6">
        {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
      </Typography>
      <VisibilitySelect item={item} edit={canEditSettings} />
      {renderMembershipSettings()}
    </Container>
  );
};

export default ItemSharingTab;
