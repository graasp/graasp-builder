import { useState } from 'react';

import { Item } from '@graasp/sdk';
import { ActionButtonVariant, PinButton as GraaspPinButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { PIN_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  type?: ActionButtonVariant;
  item: Item;
  onClick?: () => void;
};

const PinButton = ({ item, type, onClick }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const editItem = mutations.useEditItem();
  const [isPinned, setPinned] = useState(item?.settings?.isPinned);

  const handlePin = () => {
    setPinned(!isPinned);

    editItem.mutate({
      id: item.id,
      name: item.name,
      settings: {
        isPinned: !isPinned,
      },
    });
    onClick?.();
  };

  const pinText = translateBuilder(BUILDER.PIN_ITEM_PIN_TEXT);
  const unPinText = translateBuilder(BUILDER.PIN_ITEM_UNPIN_TEXT);

  return (
    <GraaspPinButton
      type={type}
      onClick={handlePin}
      isPinned={isPinned}
      pinText={pinText}
      unPinText={unPinText}
      menuItemClassName={PIN_ITEM_BUTTON_CLASS}
    />
  );
};

export default PinButton;
