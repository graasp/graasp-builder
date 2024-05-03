import { Alert, AlertTitle, Stack, Typography } from '@mui/material';

import { Invitation, ItemMembership, PermissionLevel } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import { AxiosError } from 'axios';

import { useBuilderTranslation, useMessagesTranslation } from '@/config/i18n';
import { SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { getErrorFromPayload } from '@/utils/errorMessages';

const ErrorDisplay = ({ errorMessage }: { errorMessage: string }): string => {
  const { t } = useBuilderTranslation();
  const { t: translateMessages } = useMessagesTranslation();
  switch (errorMessage) {
    case 'MODIFY_EXISTING': {
      return t(
        'You are trying to import a user that already has a permission on this item. We currently do not support this. Please remove users that already have permissions on this item from your csv file and try again.',
      );
    }
    default: {
      return translateMessages(FAILURE_MESSAGES.UNEXPECTED_ERROR);
    }
  }
};

const LineDisplay = ({
  email,
  permission,
}: {
  email: string;
  permission: PermissionLevel;
}) => (
  <Stack direction="row" gap={1}>
    <Typography>{email}</Typography>
    <Typography>{permission}</Typography>
  </Stack>
);

type Props = {
  userCsvData?:
    | { memberships: ItemMembership[]; invitations: Invitation[] }
    | {
        groupName: string;
        memberships: ItemMembership[];
        invitations: Invitation[];
      }[];
  error: Error | null | AxiosError;
};
const DisplayInvitationSummary = ({
  userCsvData,
  error,
}: Props): JSX.Element | false => {
  const { t } = useBuilderTranslation();
  if (error) {
    const additionalMessage = getErrorFromPayload(error);

    return (
      <Alert severity="error">
        <AlertTitle>{t(additionalMessage.name)}</AlertTitle>
        <Typography>
          <ErrorDisplay errorMessage={additionalMessage.message} />
        </Typography>
      </Alert>
    );
  }
  if (userCsvData) {
    // display group creation
    if (Array.isArray(userCsvData)) {
      return (
        <Alert severity="info" id={SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID}>
          <AlertTitle>{t('Summary of the structure created')}</AlertTitle>
          <Stack direction="column" gap={2}>
            {userCsvData.map(({ groupName, memberships, invitations }) => (
              <Stack>
                <Typography fontWeight="bold">
                  {t(BUILDER.INVITATION_SUMMARY_GROUP_TITLE, { groupName })}
                </Typography>
                <Stack>
                  {memberships.map((m) => (
                    <LineDisplay
                      email={m.member.email}
                      permission={m.permission}
                    />
                  ))}
                </Stack>
                <Stack>
                  {invitations.map((m) => (
                    <LineDisplay email={m.email} permission={m.permission} />
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Alert>
      );
    }

    return (
      <Alert severity="success">
        <AlertTitle>{t(BUILDER.IMPORT_CSV_SUCCESS_TITLE)}</AlertTitle>
        <Typography>{t(BUILDER.IMPORT_CSV_SUCCESS_TEXT)}</Typography>
      </Alert>
    );
  }
  return false;
};
export default DisplayInvitationSummary;
