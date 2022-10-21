import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Grid } from '@mui/material';

import { FC, useContext } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Button, ForbiddenContent } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../config/selectors';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { CurrentUserContext } from '../context/CurrentUserContext';
import Main from './Main';

const ItemForbiddenScreen: FC = () => {
  const { data: member } = useContext(CurrentUserContext);
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { t: translateBuilder } = useBuilderTranslation();

  const ButtonContent = (
    <Button
      variant="outlined"
      startIcon={<AccountCircleIcon />}
      sx={{ my: 1, mx: 'auto' }}
    >
      {member
        ? translateBuilder(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_IN)
        : translateBuilder(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_OUT)}
    </Button>
  );

  return (
    <Main>
      <Grid
        id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        height="90%"
      >
        <Grid item>
          <ForbiddenContent signOut={signOut} user={member} />
          <UserSwitchWrapper ButtonContent={ButtonContent} />
        </Grid>
      </Grid>
    </Main>
  );
};

export default ItemForbiddenScreen;
