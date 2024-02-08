import { ButtonProps } from '@mui/material';

import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useCommonTranslation } from '../../config/i18n';

type Props = {
  onClick: () => void;
  color?: ButtonProps['color'];
  id?: string;
  disabled?: boolean;
};

const CancelButton = ({ id, onClick, color, disabled }: Props): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  return (
    <Button
      id={id}
      onClick={onClick}
      variant="text"
      color={color}
      disabled={disabled}
    >
      {translateCommon(COMMON.CANCEL_BUTTON)}
    </Button>
  );
};

export default CancelButton;
