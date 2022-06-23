import React from 'react';
import { useTranslation } from 'react-i18next';
import BlockIcon from '@material-ui/icons/Block';
import { Button } from '@graasp/ui';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import Main from './Main';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    textAlign: 'center',
    height: '90%',
  },
  switchButton: {
    margin: theme.spacing(1, 'auto'),
  },
  icon: {
    fontSize: '1.5em',
  },
}));

function ItemForbiddenScreen() {
  const { t } = useTranslation();
  const classes = useStyles();

  const ButtonContent = (
    <Button
      variant="outlined"
      startIcon={<AccountCircleIcon />}
      className={classes.switchButton}
    >
      {t('Switch account')}
    </Button>
  );

  return (
    <Main>
      <Grid
        id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
        container
        justifyContent="center"
        alignItems="center"
        className={classes.wrapper}
      >
        <Grid item>
          <Typography variant="h4">
            <IconButton>
              <BlockIcon className={classes.icon} />
            </IconButton>
            {t('You cannot access this item')}
          </Typography>
          <Typography variant="body1">
            {t(
              'Your current account does not have the rights to access this item.',
            )}
          </Typography>
          <UserSwitchWrapper ButtonContent={ButtonContent} />
        </Grid>
      </Grid>
    </Main>
  );
}

export default ItemForbiddenScreen;
