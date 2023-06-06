import { ButtonProps } from '@mui/material/Button';

import { MouseEventHandler } from 'react';

import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useCommonTranslation } from '../../config/i18n';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: ButtonProps['color'];
  id?: string;
};

const CancelButton = ({ onClick, color, id }: Props): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  return (
    <Button onClick={onClick} variant="text" color={color} id={id}>
      {translateCommon(COMMON.CANCEL_BUTTON)}
    </Button>
  );
};

export default CancelButton;
