import { RecordOf } from 'immutable';

import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { PinButton as GraaspPinButton } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';
import { PIN_ITEM_BUTTON_CLASS } from '../../config/selectors';

type Props = {
  type?: string;
  item: RecordOf<Item>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick: Function;
};

const PinButton: FC<Props> = ({ item, type, onClick }) => {
  const { t } = useTranslation();

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

  const pinText = t('Pin');
  const unPinText = t('UnPin');

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
