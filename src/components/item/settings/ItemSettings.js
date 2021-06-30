import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import { Divider, makeStyles } from '@material-ui/core';
import ItemLoginSetting from './ItemLoginSetting';
import ItemMembershipsTable from '../ItemMembershipsTable';

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

const ItemSettings = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Settings')}
      </Typography>
      <ItemLoginSetting item={item} />
      <Divider className={classes.divider} />
      <ItemMembershipsTable id={item.get('id')} />
    </Container>
  );
};
ItemSettings.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};
export default ItemSettings;
