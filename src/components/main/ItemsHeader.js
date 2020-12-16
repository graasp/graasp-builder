import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import Navigation from '../layout/Navigation';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const ItemsHeader = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation />
      <Tooltip title={t('These are your items')} placement="left">
        <Info color="primary" fontSize="small" />
      </Tooltip>
    </div>
  );
};

export default ItemsHeader;
