import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack } from '@mui/material';

import { Button, ForbiddenContent } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import Main from './Main';

const ItemForbiddenScreen = (): JSX.Element => {
  const { data: member } = useCurrentUserContext();
  const { t } = useBuilderTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {member
        ? t(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_IN)
        : t(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_OUT)}
    </Button>
  );

  return (
    <Main>
      <Stack
        id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={2}
      >
        <ForbiddenContent
          memberId={member?.id}
          title={t(BUILDER.FORBIDDEN_ACCESS_TITLE)}
          authenticatedText={t(
            BUILDER.FORBIDDEN_ACCESS_AUTHENTICATED_HELPER_TEXT,
          )}
        />
        <UserSwitchWrapper ButtonContent={ButtonContent} />
      </Stack>
    </Main>
  );
};

export default ItemForbiddenScreen;
