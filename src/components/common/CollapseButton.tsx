import { useEffect, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { DiscriminatedItem } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import {
  ActionButton,
  ActionButtonVariant,
  CollapseButton as GraaspCollapseButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const CollapseButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = useMutation<
    unknown,
    unknown,
    Partial<DiscriminatedItem>
  >(MUTATION_KEYS.EDIT_ITEM);
  const [isCollapsible, setIsCollapsible] = useState(
    item?.settings?.isCollapsible ?? false,
  );

  useEffect(() => {
    setIsCollapsible(item?.settings?.isCollapsible ?? false);
  }, [item]);

  const handleCollapse = () => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        isCollapsible: !isCollapsible,
      },
    });
    onClick?.();
  };

  return (
    <GraaspCollapseButton
      type={type}
      collapseText={translateBuilder(BUILDER.COLLAPSE_ITEM_COLLAPSE_TEXT)}
      unCollapseText={translateBuilder(BUILDER.COLLAPSE_ITEM_UNCOLLAPSE_TEXT)}
      menuItemClassName={COLLAPSE_ITEM_BUTTON_CLASS}
      iconClassName={COLLAPSE_ITEM_BUTTON_CLASS}
      isCollapsed={isCollapsible}
      onClick={handleCollapse}
    />
  );
};

export default CollapseButton;
