import { Record } from 'immutable';
import partition from 'lodash.partition';
import PropTypes from 'prop-types';

import { Divider } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { isPseudonymizedMember } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { hooks } from '../../../config/queryClient';
import { getItemLoginSchema } from '../../../utils/itemExtra';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import CsvInputParser from './CsvInputParser';
import InvitationsTable from './InvitationsTable';
import ItemMembershipsTable from './ItemMembershipsTable';
import SharingLink from './SharingLink';
import VisibilitySelect from './VisibilitySelect';

const ItemSharingTab = ({ item }) => {
  const { t } = useTranslation();
  const { data: memberships } = hooks.useItemMemberships(item?.id);
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);
  const { data: members } = hooks.useMembers(
    memberships?.map(({ memberId }) => memberId),
  );
  const { data: invitations } = hooks.useItemInvitations(item?.id);

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  if (isLoadingCurrentMember) {
    return <Loader />;
  }

  const renderMembershipSettings = () => {
    // do not display settings if cannot access memberships
    if (!memberships || !canEdit) {
      return null;
    }

    const [authenticatedMemberships, authorizedMemberships] = partition(
      memberships.toJS(),
      ({ memberId }) => {
        const member = members?.find(({ id: mId }) => mId === memberId);
        return member?.email && isPseudonymizedMember(member.email);
      },
    );

    return (
      <>
        <Divider sx={{ my: 3 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" m={0} p={0}>
            {t('Authorized Members')}
          </Typography>
          {canEdit && <CsvInputParser item={item} />}
        </Grid>
        {canEdit && <CreateItemMembershipForm item={item} members={members} />}
        <ItemMembershipsTable
          item={item}
          emptyMessage={t('No user has access to this item.')}
          memberships={authorizedMemberships}
        />

        {/* show authenticated members if login schema is defined
        todo: show only if item is pseudomized
        */}
        {getItemLoginSchema(item?.extra) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" m={0} p={0}>
              {t('Authenticated Members')}
            </Typography>
            <ItemMembershipsTable
              item={item}
              memberships={authenticatedMemberships}
              emptyMessage={t('No user has authenticated to this item yet.')}
              showEmail={false}
            />
          </>
        )}

        {Boolean(invitations?.size) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5">{t('Pending Invitations')}</Typography>
            <InvitationsTable
              item={item}
              invitations={invitations}
              emptyMessage={t('No invitation for this item yet.')}
            />
          </>
        )}
      </>
    );
  };

  return (
    <Container disableGutters mt={2}>
      <Typography variant="h4">{t('Sharing')}</Typography>
      <SharingLink itemId={item.id} />
      <VisibilitySelect item={item} edit={canEdit} />
      {renderMembershipSettings()}
    </Container>
  );
};
ItemSharingTab.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ItemSharingTab;
