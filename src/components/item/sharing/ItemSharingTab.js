import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import partition from 'lodash.partition';
import { Record } from 'immutable';
import { Loader } from '@graasp/ui';
import { isPseudonymizedMember } from '@graasp/utils';
import { useTranslation } from 'react-i18next';
import { Divider, makeStyles } from '@material-ui/core';
import ItemMembershipsTable from './ItemMembershipsTable';
import SharingLink from './SharingLink';
import VisibilitySelect from './VisibilitySelect';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import { hooks } from '../../../config/queryClient';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import { getItemLoginSchema } from '../../../utils/itemExtra';
import { LayoutContext } from '../../context/LayoutContext';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import InvitationsTable from './InvitationsTable';
import CsvInputParser from './CsvInputParser';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: 0,
  },
  wrapper: {
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const ItemSharingTab = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: memberships } = hooks.useItemMemberships(item?.id);
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);
  const { data: members } = hooks.useMembers(
    memberships?.map(({ memberId }) => memberId),
  );
  const { setIsItemSharingOpen } = useContext(LayoutContext);
  const { data: invitations } = hooks.useItemInvitations(item?.id);

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  useEffect(
    () => () => {
      setIsItemSharingOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        <Divider className={classes.divider} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" className={classes.title}>
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
            <Divider className={classes.divider} />
            <Typography variant="h5" className={classes.title}>
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
            <Divider className={classes.divider} />
            <Typography variant="h5" className={classes.title}>
              {t('Pending Invitations')}
            </Typography>
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
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Sharing')}
      </Typography>
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
