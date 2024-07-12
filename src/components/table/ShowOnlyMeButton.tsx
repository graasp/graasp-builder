import { Chip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { ACCESSIBLE_ITEMS_ONLY_ME_ID } from '@/config/selectors';

import { BUILDER } from '../../langs/constants';

const ShowOnlyMeButton = ({
  onClick,
  enabled = false,
}: {
  onClick?: (value: boolean) => void;
  enabled?: boolean;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Chip
      color="primary"
      onClick={() => {
        onClick?.(!enabled);
      }}
      variant={enabled ? 'filled' : 'outlined'}
      sx={{ fontSize: '1rem', maxWidth: 'max-content' }}
      id={ACCESSIBLE_ITEMS_ONLY_ME_ID}
      label={translateBuilder(BUILDER.HOME_SHOW_ONLY_CREATED_BY_ME)}
    />
  );
};

export default ShowOnlyMeButton;
