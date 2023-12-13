import {
  DiscriminatedItem,
  Item,
  ItemType,
  ShortcutItemType,
} from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { TREE_MODAL_MY_ITEMS_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal, { TreeModalProps } from './TreeModal';

interface Props {
  open: boolean;
  item: Item;
  onClose: () => void;
}
const CreateShortcutModal = ({ open, item, onClose }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: createShortcut } = mutations.usePostItem();

  const onConfirm: TreeModalProps['onConfirm'] = ({ ids: [target], to }) => {
    const shortcut: Partial<ShortcutItemType> &
      Pick<DiscriminatedItem, 'name' | 'type'> & {
        parentId?: string;
      } = {
      name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
        name: item?.name,
      }),
      extra: buildShortcutExtra(target),
      type: ItemType.SHORTCUT,
      // set parent id if not root
      parentId: to !== TREE_MODAL_MY_ITEMS_ID ? to : undefined,
    };
    createShortcut(shortcut);
  };

  return (
    <TreeModal
      onClose={onClose}
      open={open}
      itemIds={[item?.id || '']}
      onConfirm={onConfirm}
      title={translateBuilder(BUILDER.CREATE_SHORTCUT_MODAL_TITLE)}
      actionTitle={translateBuilder(
        BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM,
      )}
    />
  );
};

export default CreateShortcutModal;
