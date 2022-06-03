import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';
import { MUTATION_KEYS } from '@graasp/query-client';

import { useMutation, hooks } from '../../config/queryClient';
import { DOMAIN, SIGN_IN_PATH } from '../../config/constants';
import { MEMBER_PROFILE_PATH } from '../../config/paths';
import { CurrentUserContext } from '../context/CurrentUserContext';

const UserSwitchWrapper = ({ ButtonContent }) => {
  const {
    data: member,
    isLoading,
    isSuccess: isSuccessUser,
  } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: switchUser } = useMutation(MUTATION_KEYS.SWITCH_MEMBER);

  return (
    <>
      <GraaspUserSwitch
        ButtonContent={ButtonContent}
        navigate={navigate}
        signOut={signOut}
        currentMember={member}
        isCurrentMemberLoading={isLoading}
        isCurrentMemberSuccess={isSuccessUser}
        useAvatar={hooks.useAvatar}
        switchUser={switchUser}
        seeProfileText={t('See Profile')}
        signedOutTooltipText={t('You are not signed in.')}
        signOutText={t('Sign Out')}
        switchUserText={t('Sign in with another account')}
        profilePath={MEMBER_PROFILE_PATH}
        domain={DOMAIN}
        redirectPath={SIGN_IN_PATH}
        useMembers={hooks.useMembers}
      />
    </>
  );
};

UserSwitchWrapper.propTypes = {
  ButtonContent: PropTypes.node,
};

UserSwitchWrapper.defaultProps = {
  ButtonContent: null,
};

export default UserSwitchWrapper;
