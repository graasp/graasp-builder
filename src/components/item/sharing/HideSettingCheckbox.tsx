import { ItemTagType, PackedItem } from '@graasp/sdk';

import { EyeIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { SETTINGS_HIDE_ITEM_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemSettingCheckBoxProperty from '../settings/ItemSettingCheckBoxProperty';

const HideSettingCheckbox = ({ item }: { item: PackedItem }): JSX.Element => {
  const { mutate: postItemTag } = mutations.usePostItemTag();
  const { mutate: deleteItemTag } = mutations.useDeleteItemTag();
  const { t: translateBuilder } = useBuilderTranslation();

  const isDisabled = item.hidden && item.hidden?.item.id !== item.id;

  return (
    <ItemSettingCheckBoxProperty
      id={SETTINGS_HIDE_ITEM_ID}
      disabled={isDisabled}
      title={translateBuilder(BUILDER.HIDE_ITEM_SETTING_TITLE)}
      icon={<EyeIcon />}
      checked={Boolean(item.hidden)}
      onClick={(checked: boolean): void => {
        if (checked) {
          postItemTag({ itemId: item.id, type: ItemTagType.Hidden });
        } else {
          deleteItemTag({
            itemId: item.id,
            type: ItemTagType.Hidden,
          });
        }
      }}
      valueText={(() => {
        if (isDisabled) {
          return translateBuilder(BUILDER.HIDE_ITEM_HIDDEN_PARENT_INFORMATION);
        }
        return translateBuilder(BUILDER.HIDE_ITEM_SETTING_DESCRIPTION);
      })()}
    />
  );
};

export default HideSettingCheckbox;
