import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Divider, Stack, Typography } from '@mui/material';

import { DiscriminatedItem, ItemLoginSchemaType } from '@graasp/sdk';
import { Button, ForbiddenContent } from '@graasp/ui';

import UserSwitchWrapper from '@/components/common/UserSwitchWrapper';
import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../../config/selectors';
import RequestAccessContent from './RequestAccessContent';

type Props = {
  itemId?: DiscriminatedItem['id'];
  itemLoginSchemaType?: ItemLoginSchemaType;
};

const ItemForbiddenScreen = ({
  itemId,
  itemLoginSchemaType,
}: Props): JSX.Element => {
  const { data: member } = hooks.useCurrentMember();
  const { t: translateBuilder } = useBuilderTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {translateBuilder('Sign out and Access login')}
    </Button>
  );

  return (
    <Stack
      id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      {!member || !itemId ? (
        <ForbiddenContent />
      ) : (
        <>
          <RequestAccessContent itemId={itemId} member={member} />
          {itemLoginSchemaType && (
            <>
              <Divider variant="middle" flexItem>
                or
              </Divider>
              <Typography variant="subtitle2">
                You can access this item with a local account if you sign out
              </Typography>
              <UserSwitchWrapper ButtonContent={ButtonContent} />
            </>
          )}
        </>
      )}
    </Stack>
  );
};

export default ItemForbiddenScreen;
