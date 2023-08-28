import { ShareButton as GraaspShareButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  SHARE_ITEM_BUTTON_CLASS,
  buildShareButtonId,
} from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { BUILDER } from '../../langs/constants';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const ShareButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Sharing
        ? null
        : ItemActionTabs.Sharing,
    );
  };

  return (
    <GraaspShareButton
      tooltip={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
      ariaLabel={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
      className={SHARE_ITEM_BUTTON_CLASS}
      onClick={onClick}
      open={openedActionTabId === ItemActionTabs.Sharing}
      id={buildShareButtonId(itemId)}
    />
  );
};

export default ShareButton;
