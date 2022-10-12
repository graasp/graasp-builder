import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Container, Grid, IconButton, Typography } from '@mui/material';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ACCOUNT, namespaces } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { DEFAULT_EMAIL_FREQUENCY, DEFAULT_LANG } from '../../config/constants';
import notifier from '../../config/notifier';
import {
  MEMBER_PROFILE_EMAIL_FREQ_SWITCH_ID,
  MEMBER_PROFILE_EMAIL_ID,
  MEMBER_PROFILE_INSCRIPTION_DATE_ID,
  MEMBER_PROFILE_LANGUAGE_SWITCH_ID,
  MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID,
  MEMBER_PROFILE_MEMBER_ID_ID,
  MEMBER_PROFILE_MEMBER_NAME_ID,
} from '../../config/selectors';
import { COPY_MEMBER_ID_TO_CLIPBOARD } from '../../types/clipboard';
import { copyToClipboard } from '../../utils/clipboard';
import { formatDate } from '../../utils/date';
import { CurrentUserContext } from '../context/CurrentUserContext';
import Main from '../main/Main';
import AvatarSetting from './AvatarSetting';
import DeleteMemberDialog from './DeleteMemberDialog';
import EmailPreferenceSwitch from './EmailPreferenceSwitch';
import LanguageSwitch from './LanguageSwitch';
import PasswordSetting from './PasswordSetting';

const MemberProfileScreen = () => {
  const { t } = useTranslation(namespaces.account);
  const { data: member, isLoading } = useContext(CurrentUserContext);

  if (isLoading) {
    return <Loader />;
  }

  const copyIdToClipboard = () => {
    copyToClipboard(member.id, {
      onSuccess: () => {
        notifier({ type: COPY_MEMBER_ID_TO_CLIPBOARD.SUCCESS, payload: {} });
      },
      onError: () => {
        notifier({ type: COPY_MEMBER_ID_TO_CLIPBOARD.FAILURE, payload: {} });
      },
    });
  };

  return (
    <Main>
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" id={MEMBER_PROFILE_MEMBER_NAME_ID}>
              {member.name}
            </Typography>
            {/* todo: display only as light user */}
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography>{t(ACCOUNT.PROFILE_MEMBER_ID_TITLE)}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography id={MEMBER_PROFILE_MEMBER_ID_ID}>
                  {member.id}
                  <IconButton
                    id={MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID}
                    onClick={copyIdToClipboard}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography>{t(ACCOUNT.PROFILE_EMAIL_TITLE)}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography id={MEMBER_PROFILE_EMAIL_ID}>
                  {member.email}
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography>{t(ACCOUNT.PROFILE_CREATED_AT_TITLE)}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography id={MEMBER_PROFILE_INSCRIPTION_DATE_ID}>
                  {formatDate(member.createdAt)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography>{t(ACCOUNT.PROFILE_LANGUAGE_TITLE)}</Typography>
              </Grid>
              <Grid item xs={8}>
                <LanguageSwitch
                  id={MEMBER_PROFILE_LANGUAGE_SWITCH_ID}
                  memberId={member.id}
                  lang={member.extra?.lang || DEFAULT_LANG}
                />
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography>
                  {t(ACCOUNT.PROFILE_EMAIL_FREQUENCY_TITLE)}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <EmailPreferenceSwitch
                  id={MEMBER_PROFILE_EMAIL_FREQ_SWITCH_ID}
                  memberId={member.id}
                  emailFreq={member.extra?.emailFreq || DEFAULT_EMAIL_FREQUENCY}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <AvatarSetting user={member} />
        <PasswordSetting user={member} />
        <DeleteMemberDialog id={member?.id} />
      </Container>
    </Main>
  );
};

export default MemberProfileScreen;
