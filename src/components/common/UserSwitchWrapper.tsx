import { RecordOf } from 'immutable';

import { FC, useContext } from 'react';
import { useNavigate } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Member } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { DOMAIN, SIGN_IN_PATH } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { MEMBER_PROFILE_PATH } from '../../config/paths';
import { hooks, useMutation } from '../../config/queryClient';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '../../config/selectors';
import { CurrentUserContext } from '../context/CurrentUserContext';
import MemberAvatar from './MemberAvatar';

type Props = {
  ButtonContent: JSX.Element;
};

const UserSwitchWrapper: FC<Props> = ({ ButtonContent }) => {
  const {
    data: member,
    isLoading,
    isSuccess: isSuccessUser,
  } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: signOut } = useMutation<any, any, any>(
    MUTATION_KEYS.SIGN_OUT,
  );
  const { mutate: switchMember } = useMutation<any, any, any>(
    MUTATION_KEYS.SWITCH_MEMBER,
  );
  // todo: fix in query client and ui
  const switchMemberFn = switchMember as (args: {
    memberId: string;
    domain: string;
  }) => Promise<void>;

  const renderAvatar = (m: RecordOf<Member>) => <MemberAvatar id={m.id} />;

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      navigate={navigate}
      signOut={signOut}
      currentMember={member}
      isCurrentMemberLoading={isLoading}
      isCurrentMemberSuccess={isSuccessUser}
      useAvatar={hooks.useAvatar}
      switchMember={switchMemberFn}
      seeProfileText={translateBuilder(BUILDER.USER_SWITCH_PROFILE_BUTTON)}
      signedOutTooltipText={translateBuilder(
        BUILDER.USER_SWITCH_SIGNED_OUT_TOOLTIP,
      )}
      signOutText={translateBuilder(BUILDER.USER_SWITCH_SIGN_OUT_BUTTON)}
      switchMemberText={translateBuilder(BUILDER.USER_SWITCH_SWITCH_USER_TEXT)}
      profilePath={MEMBER_PROFILE_PATH}
      domain={DOMAIN}
      redirectPath={SIGN_IN_PATH}
      useMembers={hooks.useMembers}
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
