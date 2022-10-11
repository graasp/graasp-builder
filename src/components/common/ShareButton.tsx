import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ShareButton as GraaspShareButton } from '@graasp/ui';

import { ITEM_ACTION_TABS } from '../../config/constants';
import {
  SHARE_ITEM_BUTTON_CLASS,
  buildShareButtonId,
} from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const ShareButton: FC<Props> = ({ itemId }) => {
  const { t } = useTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.SHARING
        ? null
        : ITEM_ACTION_TABS.SHARING,
    );
  };

  return (
    <GraaspShareButton
      tooltip={t('Share')}
      ariaLabel={t('Share')}
      className={SHARE_ITEM_BUTTON_CLASS}
      onClick={onClick}
      open={openedActionTabId === ITEM_ACTION_TABS.SHARING}
      id={buildShareButtonId(itemId)}
    />
  );
};

export default ShareButton;
