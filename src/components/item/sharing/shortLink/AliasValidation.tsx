import { useEffect, useState } from 'react';

import { FormHelperText, styled } from '@mui/material';

import { ShortLinkAvailable } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';
import { isValidAlias } from '@/utils/shortLink';

const WrapHelper = styled(FormHelperText)(() => ({
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
  maxWidth: '240px',
}));

type Props = {
  alias: string;
  hasAliasChanged: boolean;
  isAvailableLoading: boolean;
  shortLinkAvailable?: ShortLinkAvailable;
  onValidAlias: (isValid: boolean) => void;
  onError: (hasError: boolean) => void;
};

const AliasValidation = ({
  alias,
  hasAliasChanged,
  isAvailableLoading,
  shortLinkAvailable,
  onValidAlias,
  onError,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const ALIAS_VALID_MSG = translateBuilder(BUILDER.ALIAS_VALID_MSG);
  const ALIAS_UNCHANGED_MSG = translateBuilder(BUILDER.ALIAS_UNCHANGED_MSG);
  const ALIAS_ALREADY_EXIST = translateBuilder(BUILDER.ALIAS_ALREADY_EXIST);

  const [message, setMessage] = useState<string>(ALIAS_VALID_MSG);
  const [valid, setValid] = useState<boolean>(true);
  const [available, setAvailable] = useState<boolean>(false);

  const hasError = !valid || (!isAvailableLoading && !available);

  // check for the validity and availability of the alias
  useEffect(() => {
    const { isValid, messageKey, data } = isValidAlias(alias);
    setValid(isValid);

    if (!isValid) {
      const msgKey = messageKey ?? BUILDER.SHORT_LINK_UNKNOWN_ERROR;
      setMessage(translateBuilder(msgKey, { data }));
    } else if (!hasAliasChanged) {
      setMessage(ALIAS_UNCHANGED_MSG);
      setAvailable(true);
    } else if (isAvailableLoading) {
      setMessage(translateBuilder(BUILDER.ALIAS_CHECKING_MSG));
    } else {
      const aliasAvailable = Boolean(shortLinkAvailable?.available);
      setMessage(aliasAvailable ? ALIAS_VALID_MSG : ALIAS_ALREADY_EXIST);
      setAvailable(aliasAvailable);
    }

    onValidAlias(valid);
    onError(hasError);
  }, [
    alias,
    hasAliasChanged,
    isAvailableLoading,
    shortLinkAvailable?.available,
    translateBuilder,
    ALIAS_UNCHANGED_MSG,
    ALIAS_VALID_MSG,
    ALIAS_ALREADY_EXIST,
    onValidAlias,
    valid,
    onError,
    hasError,
  ]);

  return <WrapHelper error={hasError}>{message}</WrapHelper>;
};

export default AliasValidation;
