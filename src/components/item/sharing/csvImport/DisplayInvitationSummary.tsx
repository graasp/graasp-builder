import { Alert, AlertTitle, Stack, Typography } from '@mui/material';

import {
  AccountType,
  Invitation,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';
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
      return t(BUILDER.SHARE_ITEM_CSV_SUMMARY_MODIFYING_EXISTING);
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
  userCsvDataWithTemplate?: {
    groupName: string;
    memberships: ItemMembership[];
    invitations: Invitation[];
  }[];
  error: Error | null | AxiosError;
};
const DisplayInvitationSummary = ({
  userCsvDataWithTemplate,
  error,
}: Props): JSX.Element | null => {
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
  if (userCsvDataWithTemplate) {
    // display group creation
    return (
      <Alert severity="info" id={SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID}>
        <AlertTitle>{t(BUILDER.SHARE_ITEM_CSV_SUMMARY_GROUP_TITLE)}</AlertTitle>
        <Stack direction="column" gap={2}>
          {userCsvDataWithTemplate.map(
            ({ groupName, memberships, invitations }) => (
              <Stack>
                <Typography fontWeight="bold">
                  {t(BUILDER.INVITATION_SUMMARY_GROUP_TITLE, { groupName })}
                </Typography>
                <Stack>
                  {memberships.map((m) => (
                    <LineDisplay
                      email={
                        m.account.type === AccountType.Individual
                          ? m.account.email
                          : '-'
                      }
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
            ),
          )}
        </Stack>
      </Alert>
    );
  }

  // no error and no data, display nothing
  return null;
};
export default DisplayInvitationSummary;
