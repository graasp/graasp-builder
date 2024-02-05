import { Stack, Switch, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBuilderTranslation } from '@/config/i18n';
import { ACCESSIBLE_ITEMS_ONLY_ME_ID } from '@/config/selectors';
import { ShowOnlyMeChangeType } from '@/config/types';

import SelectTypes from '../common/SelectTypes';

type Props = {
  title: string;
  headerElements?: JSX.Element[];
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
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
      <Stack direction="column" mt={1} mb={1}>
        {onShowOnlyMeChange && (
          <FormControlLabel
            control={
              <Switch
                id={ACCESSIBLE_ITEMS_ONLY_ME_ID}
                checked={showOnlyMe}
                onChange={(_, checked) => onShowOnlyMeChange(checked)}
              />
            }
            label={t('Show only created by me')}
          />
        )}
        <SelectTypes />
      </Stack>
    </>
  );
};
export default ItemsToolbar;
