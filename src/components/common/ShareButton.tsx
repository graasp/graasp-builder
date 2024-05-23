import { Link, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Link
      to={{
        pathname: buildItemSharePath(itemId),
        search: searchParams.toString(),
      }}
    >
      <GraaspShareButton
        tooltip={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        ariaLabel={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        className={SHARE_ITEM_BUTTON_CLASS}
        id={buildShareButtonId(itemId)}
      />
    </Link>
  );
};

export default ShareButton;
