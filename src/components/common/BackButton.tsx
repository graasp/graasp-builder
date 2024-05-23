import { Link, LinkProps } from 'react-router-dom';

import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

interface Props {
  to: LinkProps['to'];
}
const BackButton = ({ to }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Tooltip title={t(BUILDER.BACK)}>
      <Link to={to}>
        <IconButton>
          <ArrowCircleLeftRoundedIcon fontSize="large" />
        </IconButton>
      </Link>
    </Tooltip>
  );
};

export default BackButton;
