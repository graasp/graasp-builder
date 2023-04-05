import { useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { DiscriminatedItem } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import {
  ActionButton,
  ActionButtonVariant,
  HideButton as GraaspHideButton,
} from '@graasp/ui';

import { HIDDEN_ITEM_TAG_ID } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { hooks, useMutation } from '../../config/queryClient';
import {
  HIDDEN_ITEM_BUTTON_CLASS,
  buildHideButtonId,
} from '../../config/selectors';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const HideButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: tags } = hooks.useItemTags(item.id);
  const addTag = useMutation<unknown, unknown, { id: string; tagId: string }>(
    MUTATION_KEYS.POST_ITEM_TAG,
  );
  const removeTag = useMutation<
    unknown,
    unknown,
    { id: string; tagId: string }
  >(MUTATION_KEYS.DELETE_ITEM_TAG);
  const hiddenTag = tags
    ?.filter(({ tagId }) => tagId === HIDDEN_ITEM_TAG_ID)
    ?.first();
  // since children items are hidden because parent is hidden, the hidden tag should be removed from the root item
  // if hiddenTag is undefined -> the item is not hidden
  const isOriginalHiddenItem = !hiddenTag || hiddenTag?.itemPath === item.path;
  const [isHidden, setHidden] = useState(hiddenTag !== undefined);

  const handleToggleHide = () => {
    setHidden(!isHidden);

    if (hiddenTag) {
      removeTag.mutate({
        id: item.id,
        tagId: hiddenTag.id,
      });
    } else {
      addTag.mutate({
        id: item.id,
        tagId: HIDDEN_ITEM_TAG_ID,
      });
    }
    onClick?.();
  };

  return (
    <GraaspHideButton
      type={type}
      onClick={handleToggleHide}
      isHiddenRootItem={isOriginalHiddenItem}
      menuItemClassName={HIDDEN_ITEM_BUTTON_CLASS}
      iconClassName={HIDDEN_ITEM_BUTTON_CLASS}
      isHidden={isHidden}
      hideText={translateBuilder(BUILDER.HIDE_ITEM_HIDE_TEXT)}
      showText={translateBuilder(BUILDER.HIDE_ITEM_SHOW_TEXT)}
      hiddenParentText={translateBuilder(
        BUILDER.HIDE_ITEM_HIDDEN_PARENT_INFORMATION,
      )}
      testData={buildHideButtonId(Boolean(hiddenTag))}
    />
  );
};

export default HideButton;
