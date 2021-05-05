import React, { useRef, useState } from 'react';
import {
  Container,
  TextField,
  makeStyles,
  Button,
  Tooltip,
} from '@material-ui/core';
import { useParams } from 'react-router';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useMutation } from 'react-query';
import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import {
  SETTINGS,
  SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT,
} from '../../config/constants';
import ForbiddenText from '../common/ForbiddenText';
import {
  ITEM_LOGIN_SCREEN_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  buildItemLoginSignInModeOption,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
} from '../../config/selectors';
import { isMemberIdValid } from '../../utils/member';
import { useItemLogin } from '../../hooks/item';
import Loader from '../common/Loader';
import { ITEM_LOGIN_MUTATION_KEY } from '../../config/keys';
import MemberIdTextField from './form/MemberIdTextField';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  input: {
    margin: theme.spacing(1, 0),
  },
  usernameAndMemberId: {
    display: 'flex',
    alignItems: 'center',
  },
  usernameInfo: {
    margin: theme.spacing(0, 1),
  },
  signInWithWrapper: {
    justifyContent: 'flex-end',
    marginLeft: theme.spacing(0),
  },
  signInWithWrapperLabel: {
    marginRight: theme.spacing(1),
  },
  memberIdWrapper: {
    width: '100%',
  },
  memberIdLabel: {
    marginLeft: theme.spacing(2),
  },
}));

const ItemLoginScreen = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: itemLoginSignIn } = useMutation(ITEM_LOGIN_MUTATION_KEY);
  const loginModeRef = useRef(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [signInMode, setSignInMode] = useState(
    SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT,
  );
  const { itemId } = useParams();
  const { data: itemLogin, isLoading } = useItemLogin(itemId);
  const loginSchema = itemLogin?.get('loginSchema');

  if (isLoading) {
    return <Loader />;
  }

  // no item login detected
  if (
    !itemLogin ||
    itemLogin.isEmpty() ||
    !Object.values(SETTINGS.ITEM_LOGIN.OPTIONS).includes(loginSchema)
  ) {
    return <ForbiddenText />;
  }

  const withPassword = [
    SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD,
  ].includes(loginSchema);

  const onClickSignIn = () => {
    const signInProperties = {};
    switch (signInMode) {
      case SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.MEMBER_ID:
        signInProperties.memberId = memberId;
        break;
      case SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME:
      default:
        signInProperties.username = username;
    }

    if (withPassword) {
      signInProperties.password = password;
    }

    itemLoginSignIn({ itemId, ...signInProperties });
  };

  const handleOnSignInModeChange = (e) => {
    const { value } = e.target;
    setSignInMode(value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onMemberIdChange = (e) => {
    setMemberId(e.target.value);
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const shouldSignInBeDisabled = () => {
    const usernameError =
      signInMode === SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME &&
      (!username?.length || isMemberIdValid(username));
    const memberIdError =
      signInMode === SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.MEMBER_ID &&
      !isMemberIdValid(memberId);
    const passwordError = withPassword && !password?.length;
    return usernameError || passwordError || memberIdError;
  };

  const renderMemberIdTextField = () => {
    if (signInMode !== SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.MEMBER_ID) {
      return null;
    }

    const error = memberId?.length && !isMemberIdValid(memberId);

    return (
      <FormControl className={classes.memberIdWrapper}>
        <InputLabel error={error} className={classes.memberIdLabel} shrink>
          {t('Member Id')}
        </InputLabel>
        <OutlinedInput
          autoFocus
          error={error}
          onChange={onMemberIdChange}
          label={t('Member Id')}
          inputComponent={MemberIdTextField}
          color="primary"
          fullWidth
          className={classes.input}
          id={ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID}
          value={memberId}
        />
      </FormControl>
    );
  };

  const renderUsernameTextField = () => {
    if (signInMode !== SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME) {
      return null;
    }
    const isMemberId = isMemberIdValid(username);
    const error = username?.length && isMemberId;
    const helperText = isMemberId
      ? t('This is a member id. You should switch the sign in mode.')
      : null;
    return (
      <TextField
        error={error}
        autoFocus
        onChange={onUsernameChange}
        label={t('Username')}
        color="primary"
        variant="outlined"
        fullWidth
        type="text"
        helperText={helperText}
        className={classes.input}
        id={ITEM_LOGIN_SIGN_IN_USERNAME_ID}
        value={username}
      />
    );
  };

  const renderUsernameAndMemberIdField = () => {
    const select = (
      <>
        <Tooltip
          placement="right-end"
          title={t(
            'You can create a new account with a given username or use your member id from a previous item to reuse your account.',
          )}
        >
          <InfoIcon color="primary" className={classes.usernameInfo} />
        </Tooltip>
        <Select
          onChange={handleOnSignInModeChange}
          value={signInMode}
          inputRef={loginModeRef}
          id={ITEM_LOGIN_SIGN_IN_MODE_ID}
        >
          {Object.values(SETTINGS.ITEM_LOGIN.SIGN_IN_MODE).map((value) => (
            <MenuItem value={value} id={buildItemLoginSignInModeOption(value)}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </>
    );

    return (
      <>
        <FormControlLabel
          control={select}
          classes={{
            root: classes.signInWithWrapper,
            label: classes.signInWithWrapperLabel,
          }}
          label={t('Sign In with')}
          labelPlacement="start"
        />
        <div className={classes.usernameAndMemberId}>
          {/* we actually need to render two text fields to avoid data conflicts
            using a single function returning one or the other text fields sometimes
            lead to the previous data being meld into the new textfield
          */}
          {renderUsernameTextField()}
          {renderMemberIdTextField()}
        </div>
      </>
    );
  };

  return (
    <Container
      maxWidth="xs"
      className={classes.wrapper}
      id={ITEM_LOGIN_SCREEN_ID}
    >
      {renderUsernameAndMemberIdField()}
      {withPassword && (
        <TextField
          onChange={onPasswordChange}
          label={t('Password')}
          value={password}
          type="password"
          color="primary"
          variant="outlined"
          className={classes.input}
          id={ITEM_LOGIN_SIGN_IN_PASSWORD_ID}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onClickSignIn}
        id={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
        disabled={shouldSignInBeDisabled()}
      >
        {t('Sign In')}
      </Button>
    </Container>
  );
};

export default ItemLoginScreen;
