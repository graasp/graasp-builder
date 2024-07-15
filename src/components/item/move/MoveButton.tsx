import {
  ActionButton,
  ActionButtonVariant,
  ColorVariants,
  MoveButton as GraaspMoveButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MOVE_BUTTON_CLASS,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type MoveButtonProps = {
  color?: ColorVariants;
  id?: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const MoveButton = ({
  color = 'primary',
  id,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: MoveButtonProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <GraaspMoveButton
      color={color}
      type={type}
      id={id}
      onClick={onClick}
      text={translateBuilder(BUILDER.MOVE_BUTTON)}
      menuItemClassName={ITEM_MENU_MOVE_BUTTON_CLASS}
      iconClassName={ITEM_MOVE_BUTTON_CLASS}
    />
  );
};

export default MoveButton;
