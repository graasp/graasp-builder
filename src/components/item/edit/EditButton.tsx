import { DiscriminatedItem } from '@graasp/sdk';
import {
  ActionButtonVariant,
  EditButton as GraaspEditButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  EDIT_ITEM_BUTTON_CLASS,
  buildEditButtonId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  item: DiscriminatedItem;
  type: ActionButtonVariant;
  onClick?: () => void;
};

const EditButton = ({ item, onClick, type = 'icon' }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <GraaspEditButton
      type={type}
      title={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
      id={buildEditButtonId(item.id)}
      ariaLabel={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
      className={EDIT_ITEM_BUTTON_CLASS}
      onClick={onClick}
    />
  );
};

export default EditButton;
