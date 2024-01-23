import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';

interface Props {
  onClick: () => void;
}
const BackButton = ({ onClick }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Tooltip title={t('Go Back')}>
      <IconButton onClick={onClick}>
        <ArrowCircleLeftRoundedIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
