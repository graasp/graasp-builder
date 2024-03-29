import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { ACCESSIBLE_ITEMS_ONLY_ME_ID } from '@/config/selectors';
import { ShowOnlyMeChangeType } from '@/config/types';

import SelectTypes from '../common/SelectTypes';

type Props = {
  title: string;
  subTitleElement?: JSX.Element | null;
  headerElements?: JSX.Element[];
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
  showOnlyMe?: boolean;
};

const ItemsToolbar = ({
  title,
  subTitleElement,
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {headerElements}
        </Stack>
      </Stack>
      {subTitleElement}
      <Stack direction="column" mt={2} mb={2} spacing={1}>
        {onShowOnlyMeChange && (
          <FormControlLabel
            sx={{ maxWidth: 'max-content' }}
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
