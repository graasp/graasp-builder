import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  Member,
  MembershipRequestStatus,
} from '@graasp/sdk';

import { Check, Lock } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR,
  REQUEST_MEMBERSHIP_BUTTON_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type Props = {
  member: Member;
  itemId: DiscriminatedItem['id'];
};

const RequestAccessContent = ({ member, itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    mutateAsync: requestMembership,
    isSuccess,
    isPending: isLoading,
  } = mutations.useRequestMembership();
  const { data: request } = hooks.useOwnMembershipRequest(itemId);

  if (request?.status === MembershipRequestStatus.Pending) {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        gap={2}
        data-cy={MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR}
      >
        <Lock size={40} />
        <Typography variant="h3">
          {translateBuilder(BUILDER.REQUEST_ACCESS_PENDING_TITLE)}
        </Typography>
        <Typography>
          {translateBuilder(BUILDER.REQUEST_ACCESS_PENDING_DESCRIPTION)}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <Lock size={40} />
      <Typography variant="h3">
        {translateBuilder(BUILDER.REQUEST_ACCESS_TITLE)}
      </Typography>
      <LoadingButton
        id={REQUEST_MEMBERSHIP_BUTTON_ID}
        variant="contained"
        disabled={isSuccess}
        loading={isLoading}
        endIcon={isSuccess ? <Check /> : null}
        onClick={async () => {
          await requestMembership({ id: itemId });
        }}
      >
        {isSuccess
          ? translateBuilder(BUILDER.REQUEST_ACCESS_SENT_BUTTON)
          : translateBuilder(BUILDER.REQUEST_ACCESS_BUTTON)}
      </LoadingButton>
      <Typography variant="subtitle2">
        {translateBuilder(BUILDER.ITEM_LOGIN_HELPER_SIGN_OUT, {
          email: member.email,
        })}
      </Typography>
    </Stack>
  );
};

export default RequestAccessContent;
