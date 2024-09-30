import { Link } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  IconButton,
  Link as MUILink,
  Stack,
} from '@mui/material';

import { XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  MEMBER_VALIDATION_BANNER_CLOSE_BUTTON_ID,
  MEMBER_VALIDATION_BANNER_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import useModalStatus from '../hooks/useModalStatus';

const DOCUMENTATION_ORIGIN = 'https://graasp.github.io/docs';
const MEMBER_VALIDATION_DOCUMENTATION_LINK = '/user/account/validation';
const buildLocalizedDocumentationOrigin = (lang: string = 'en') => {
  switch (lang) {
    case 'en':
      return DOCUMENTATION_ORIGIN;
    default:
      return `${DOCUMENTATION_ORIGIN}/${lang}`;
  }
};
// eslint-disable-next-line arrow-body-style
const buildLocalizedDocumentationLink = (lang: string): string => {
  // english does not use a path prefix
  return `${buildLocalizedDocumentationOrigin(lang)}${MEMBER_VALIDATION_DOCUMENTATION_LINK}`;
};

const MemberValidationBanner = (): JSX.Element | null => {
  const { isOpen, closeModal } = useModalStatus({
    isInitiallyOpen: true,
  });
  const { t, i18n } = useBuilderTranslation();
  const { data: member } = hooks.useCurrentMember();

  // banner should not be shown when the member does not have the property
  if (isOpen && member && 'isValidated' in member && !member.isValidated) {
    return (
      <Alert
        id={MEMBER_VALIDATION_BANNER_ID}
        severity="warning"
        action={
          <IconButton
            id={MEMBER_VALIDATION_BANNER_CLOSE_BUTTON_ID}
            onClick={closeModal}
          >
            <XIcon />
          </IconButton>
        }
      >
        <AlertTitle>{t(BUILDER.MEMBER_VALIDATION_TITLE)}</AlertTitle>
        <Stack gap={1}>
          {t(BUILDER.MEMBER_VALIDATION_DESCRIPTION)}
          <MUILink
            component={Link}
            to={buildLocalizedDocumentationLink(i18n.language)}
          >
            {t(BUILDER.MEMBER_VALIDATION_LINK_TEXT)}
          </MUILink>
        </Stack>
      </Alert>
    );
  }
  return null;
};
export default MemberValidationBanner;
