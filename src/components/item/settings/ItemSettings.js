import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import ItemLoginSetting from './ItemLoginSetting';
import { isSettingsEditionAllowedForUser } from '../../../utils/membership';
import { hooks } from '../../../config/queryClient';
import Loader from '../../common/Loader';

const { useCurrentMember, useItemMemberships } = hooks;

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: 0,
  },
  wrapper: {
    marginTop: theme.spacing(2),
  },
}));

const ItemSettings = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { itemId } = useParams();
  const {
    data: memberships,
    isLoading: isMembershipsLoading,
  } = useItemMemberships(itemId);
  const { data: user, isLoading: isMemberLoading } = useCurrentMember();
  const memberId = user?.get('id');

  if (isMembershipsLoading || isMemberLoading) {
    return <Loader />;
  }

  // settings are not available for user without edition membership
  if (!isSettingsEditionAllowedForUser({ memberships, memberId })) {
    return null;
  }

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h6" className={classes.title}>
        {t('Settings')}
      </Typography>
      <ItemLoginSetting />
    </Container>
  );
};

export default ItemSettings;
