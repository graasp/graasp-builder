import PropTypes from 'prop-types';

import { useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';

const ResendInvitationRenderer = (item) => {
  const { t } = useBuilderTranslation();
  const itemId = item.id;
  const { mutate: resendInvitation } = useMutation(
    MUTATION_KEYS.RESEND_INVITATION,
  );

  const ChildComponent = ({ data: invitation }) => {
    const [clicked, setClicked] = useState(false);

    const resendEmail = () => {
      setClicked(true);
      resendInvitation({ itemId, id: invitation.id });
    };

    return (
      <Button variant="outlined" onClick={resendEmail} disabled={clicked}>
        {t(BUILDER.SHARING_INVITATIONS_RESEND_BUTTON)}
      </Button>
    );
  };

  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemPath: PropTypes.string.isRequired,
      permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  };
  return ChildComponent;
};

export default ResendInvitationRenderer;
