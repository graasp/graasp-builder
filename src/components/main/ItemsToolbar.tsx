import { Stack, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBuilderTranslation } from '@/config/i18n';
import { ACCESSIBLE_ITEMS_ONLY_ME_ID } from '@/config/selectors';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
  onShowOnlyMeChange?: (e: any) => any;
  showOnlyMe?: boolean;
};

const ItemsToolbar = ({
  title,
  headerElements,
  onShowOnlyMeChange,
  showOnlyMe,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  return (
    <>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          {headerElements}
        </Stack>
      </Stack>
      {onShowOnlyMeChange && (
        <FormControlLabel
          control={
            <Checkbox
              id={ACCESSIBLE_ITEMS_ONLY_ME_ID}
              checked={showOnlyMe}
              onChange={onShowOnlyMeChange}
            />
          }
          label={t('Show only created by me')}
        />
      )}
    </>
  );
};
export default ItemsToolbar;
