import { useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Invitation } from '@graasp/query-client/dist/types';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';

type ChildProps = {
  data: Invitation;
};

const ResendInvitationRenderer = (
  item: Item,
): ((childProps: ChildProps) => JSX.Element) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const itemId = item.id;
  const { mutate: resendInvitation } = useMutation<
    unknown,
    unknown,
    { itemId: string; id: string }
  >(MUTATION_KEYS.RESEND_INVITATION);

  const ChildComponent = ({ data: invitation }) => {
    const [clicked, setClicked] = useState(false);

    const resendEmail = () => {
      setClicked(true);
      resendInvitation({ itemId, id: invitation.id });
    };

    return (
      <Button variant="outlined" onClick={resendEmail} disabled={clicked}>
        {translateBuilder(BUILDER.SHARING_INVITATIONS_RESEND_BUTTON)}
      </Button>
    );
  };

  return ChildComponent;
};

export default ResendInvitationRenderer;
