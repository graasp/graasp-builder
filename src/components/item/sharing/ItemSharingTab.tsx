import { Divider } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ItemMembership, isPseudonymizedMember } from '@graasp/sdk';
import {
  InvitationRecord,
  ItemMembershipRecord,
  ItemRecord,
} from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';
import partition from 'lodash.partition';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import {
  isItemUpdateAllowedForUser,
  isSettingsEditionAllowedForUser,
} from '../../../utils/membership';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import CsvInputParser from './CsvInputParser';
import InvitationsTable from './InvitationsTable';
import ItemMembershipsTable from './ItemMembershipsTable';
import SharingLink from './SharingLink';
import VisibilitySelect from './VisibilitySelect';

type Props = {
  item: ItemRecord;
  memberships?: List<ItemMembershipRecord>;
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

  if (isLoadingCurrentMember && isItemLoginLoading) {
    return <Loader />;
  }

  const renderMembershipSettings = () => {
    // do not display settings if cannot access memberships
    if (!memberships || !canEdit) {
      return null;
    }
    const [authenticatedMemberships, authorizedMemberships] = partition(
      memberships.toJS() as ItemMembership[],
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
          memberships={authorizedMemberships}
          readOnly={!canEditSettings}
          currentMember={currentMember}
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
              memberships={authenticatedMemberships}
              emptyMessage={translateBuilder(
                BUILDER.SHARING_AUTHENTICATED_MEMBERS_EMPTY_MESSAGE,
              )}
              showEmail={false}
              readOnly={!canEditSettings}
              currentMember={currentMember}
            />
          </>
        )}

        {Boolean(invitations?.size) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5">
              {translateBuilder(BUILDER.SHARING_INVITATIONS_TITLE)}
            </Typography>
            <InvitationsTable
              item={item}
              invitations={invitations as List<InvitationRecord>}
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
      <SharingLink itemId={item.id} />
      <Typography variant="h6">
        {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
      </Typography>
      <VisibilitySelect item={item} edit={canEditSettings} />
      {renderMembershipSettings()}
    </Container>
  );
};

export default ItemSharingTab;
