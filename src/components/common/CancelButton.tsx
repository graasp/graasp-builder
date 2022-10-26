import { ButtonProps } from '@mui/material/Button';

import { FC, MouseEventHandler } from 'react';

import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useCommonTranslation } from '../../config/i18n';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: ButtonProps['color'];
};

const CancelButton: FC<Props> = ({ onClick, color }) => {
  const { t: translateCommon } = useCommonTranslation();
  return (
    <Button onClick={onClick} variant="text" color={color}>
      {translateCommon(COMMON.CANCEL_BUTTON)}
    </Button>
  );
};

export default CancelButton;
