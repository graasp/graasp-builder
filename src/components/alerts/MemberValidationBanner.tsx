import { useState } from 'react';
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
import { BUILDER } from '@/langs/constants';

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

const MemberValidationBanner = (): JSX.Element | false => {
  const [open, setOpen] = useState(true);
  const { t, i18n } = useBuilderTranslation();
  const { data: member } = hooks.useCurrentMember();
  if (open && member?.isValidated !== true) {
    return (
      <Alert
        severity="warning"
        action={
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
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
  return false;
};
export default MemberValidationBanner;
