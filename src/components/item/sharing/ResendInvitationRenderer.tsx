import { useState } from 'react';

import { Invitation, MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import { ITEM_RESEND_INVITATION_BUTTON_CLASS } from '../../../config/selectors';

type ChildProps = {
  data: Invitation;
};

const ResendInvitationRenderer = (
  itemId: string,
): (({ data }: ChildProps) => JSX.Element) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: resendInvitation } = useMutation<
    unknown,
    unknown,
    { itemId: string; id: string }
  >(MUTATION_KEYS.RESEND_INVITATION);

  const ChildComponent = ({ data: invitation }: ChildProps) => {
    const [clicked, setClicked] = useState(false);

    const resendEmail = () => {
      setClicked(true);
      resendInvitation({ itemId, id: invitation.id });
    };

    return (
      <Button
        variant="outlined"
        onClick={resendEmail}
        disabled={clicked}
        className={ITEM_RESEND_INVITATION_BUTTON_CLASS}
      >
        {translateBuilder(BUILDER.SHARING_INVITATIONS_RESEND_BUTTON)}
      </Button>
    );
  };

  return ChildComponent;
};

export default ResendInvitationRenderer;
