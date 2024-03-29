import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Grid } from '@mui/material';

import { Button, ForbiddenContent } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import Main from './Main';

const ItemForbiddenScreen = (): JSX.Element => {
  const { data: member } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
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
          <ForbiddenContent memberId={member?.id} />
          <UserSwitchWrapper ButtonContent={ButtonContent} />
        </Grid>
      </Grid>
    </Main>
  );
};

export default ItemForbiddenScreen;
