import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack } from '@mui/material';

import { Button, ForbiddenContent } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import UserSwitchWrapper from '../common/UserSwitchWrapper';

const ItemForbiddenScreen = (): JSX.Element => {
  const { data: member } = hooks.useCurrentMember();
  const { t: translateBuilder } = useBuilderTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {member
        ? translateBuilder(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_IN)
        : translateBuilder(BUILDER.SWITCH_ACCOUNT_BUTTON_SIGNED_OUT)}
    </Button>
  );

  return (
    <Stack
      id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <ForbiddenContent memberId={member?.id} />
      <UserSwitchWrapper ButtonContent={ButtonContent} />
    </Stack>
  );
};

export default ItemForbiddenScreen;
