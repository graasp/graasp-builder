import {
  DiscriminatedItem,
  Item,
  ItemType,
  ShortcutItemType,
} from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { HOME_MODAL_ITEM_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal, { TreeModalProps } from './TreeModal';

interface Props {
  open: boolean;
  item: Item;
  onClose: () => void;
}
const CreateShortcutModal = ({
  open,
  item,
  onClose,
}: Props): JSX.Element | null => {
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
      parentId: to !== HOME_MODAL_ITEM_ID ? to : undefined,
    };
    createShortcut(shortcut);
  };

  return open ? (
    <TreeModal
      onClose={onClose}
      open={open}
      itemIds={[item?.id || '']}
      onConfirm={onConfirm}
      title={BUILDER.CREATE_SHORTCUT_MODAL_TITLE}
      actionTitle={translateBuilder(
        BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM,
      )}
    />
  ) : null;
};

export default CreateShortcutModal;
