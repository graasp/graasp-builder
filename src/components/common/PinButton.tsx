import { useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { DiscriminatedItem } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { ActionButtonVariant, PinButton as GraaspPinButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { PIN_ITEM_BUTTON_CLASS } from '../../config/selectors';

type Props = {
  type?: ActionButtonVariant;
  item: DiscriminatedItem;
  onClick?: () => void;
};

const PinButton = ({ item, type, onClick }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const editItem = useMutation<any, any, any>(MUTATION_KEYS.EDIT_ITEM);
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
      type={type as ActionButtonVariant}
      onClick={handlePin}
      isPinned={isPinned}
      pinText={pinText}
      unPinText={unPinText}
      menuItemClassName={PIN_ITEM_BUTTON_CLASS}
    />
  );
};

export default PinButton;
