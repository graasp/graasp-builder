import { RecordOf } from 'immutable';

import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Member } from '@graasp/sdk';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { DOMAIN, SIGN_IN_PATH } from '../../config/constants';
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
  const { t } = useTranslation();
  const { mutateAsync: signOut } = useMutation<any, any, any>(
    MUTATION_KEYS.SIGN_OUT,
  );
  const { mutate: switchMember } = useMutation<any, any, any>(
    MUTATION_KEYS.SWITCH_MEMBER,
  );

  const renderAvatar = (m: RecordOf<Member>) => <MemberAvatar id={member.id} />;

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      navigate={navigate}
      signOut={signOut}
      currentMember={member}
      isCurrentMemberLoading={isLoading}
      isCurrentMemberSuccess={isSuccessUser}
      useAvatar={hooks.useAvatar}
      switchMember={switchMember}
      seeProfileText={t('See Profile')}
      signedOutTooltipText={t('You are not signed in.')}
      signOutText={t('Sign Out')}
      switchMemberText={t('Sign in with another account')}
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
