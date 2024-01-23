import { useNavigate } from 'react-router';

import { ShareButton as GraaspShareButton } from '@graasp/ui';

import { buildItemSharePath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import {
  SHARE_ITEM_BUTTON_CLASS,
  buildShareButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId: string;
};

const ShareButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(buildItemSharePath(itemId));
  };

  return (
    <GraaspShareButton
      tooltip={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
      ariaLabel={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
      className={SHARE_ITEM_BUTTON_CLASS}
      onClick={onClick}
      id={buildShareButtonId(itemId)}
    />
  );
};

export default ShareButton;
