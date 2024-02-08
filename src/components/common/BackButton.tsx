import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

interface Props {
  onClick: () => void;
}
const BackButton = ({ onClick }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Tooltip title={t(BUILDER.BACK)}>
      <IconButton onClick={onClick}>
        <ArrowCircleLeftRoundedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
