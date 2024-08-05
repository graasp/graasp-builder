import { useState } from 'react';

import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import { ITEM_RESEND_INVITATION_BUTTON_CLASS } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  invitationId: string;
  itemId: string;
};

const ResendInvitation = ({ itemId, invitationId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: resendInvitation } = mutations.useResendInvitation();

  const [clicked, setClicked] = useState(false);

  const resendEmail = () => {
    setClicked(true);
    resendInvitation({ itemId, id: invitationId });
  };

  return (
    <Button
      variant="outlined"
      onClick={resendEmail}
      disabled={clicked}
      className={ITEM_RESEND_INVITATION_BUTTON_CLASS}
      size="small"
    >
      {translateBuilder(BUILDER.SHARING_INVITATIONS_RESEND_BUTTON)}
    </Button>
  );
};

export default ResendInvitation;
