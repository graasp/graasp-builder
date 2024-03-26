import { CompleteMember, buildSignInPath } from '@graasp/sdk';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { GRAASP_ACCOUNT_HOST, GRAASP_AUTH_HOST } from '@/config/env';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '@/config/selectors';

import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import MemberAvatar from './MemberAvatar';

type Props = {
  ButtonContent?: JSX.Element;
};

const UserSwitchWrapper = ({ ButtonContent }: Props): JSX.Element => {
  const { data: member, isLoading } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: signOut } = mutations.useSignOut();

  const renderAvatar = (m?: CompleteMember | null) => (
    <MemberAvatar id={m?.id} />
  );

  const redirectPath = buildSignInPath({
    host: GRAASP_AUTH_HOST,
    redirectionUrl: window.location.toString(),
  });

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      signOut={signOut}
      currentMember={member}
      userMenuItems={[]}
      isCurrentMemberLoading={isLoading}
      seeProfileText={translateBuilder(BUILDER.USER_SWITCH_PROFILE_BUTTON)}
      signedOutTooltipText={translateBuilder(
        BUILDER.USER_SWITCH_SIGNED_OUT_TOOLTIP,
      )}
      signOutText={translateBuilder(BUILDER.USER_SWITCH_SIGN_OUT_BUTTON)}
      profilePath={GRAASP_ACCOUNT_HOST}
      redirectPath={redirectPath}
      buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
      signInMenuItemId={HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}
      signOutMenuItemId={HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}
      seeProfileButtonId={HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}
      buildMemberMenuItemId={buildMemberMenuItemId}
      renderAvatar={renderAvatar}
    />
  );
};

export default UserSwitchWrapper;
