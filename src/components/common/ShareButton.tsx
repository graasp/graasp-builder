import { Link } from 'react-router-dom';

import { styled } from '@mui/material';

import {
  ActionButtonVariant,
  ShareButton as GraaspShareButton,
} from '@graasp/ui';

import { buildItemSharePath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import {
  SHARE_ITEM_BUTTON_CLASS,
  buildShareButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId: string;
  type?: ActionButtonVariant;
};

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'black',
}));

const ShareButton = ({ itemId, type }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <StyledLink to={buildItemSharePath(itemId)}>
      <GraaspShareButton
        tooltip={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        ariaLabel={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        className={SHARE_ITEM_BUTTON_CLASS}
        id={buildShareButtonId(itemId)}
        type={type}
      />
    </StyledLink>
  );
};

export default ShareButton;
