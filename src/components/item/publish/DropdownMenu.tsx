import { Box } from '@mui/material';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FC, SyntheticEvent } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  buildCategorySelectionId,
  buildCategorySelectionTitleId,
} from '../../../config/selectors';
import { Category } from '../../../config/types';

type Props = {
  title: string;
  valueList: Category[];
  selectedValues: Category[];
  handleChange: (
    _event: SyntheticEvent,
    value: Category[],
    reason: AutocompleteChangeReason,
  ) => void;
};

const DropdownMenu: FC<Props> = ({
  title,
  handleChange,
  valueList,
  selectedValues,
}) => {
  const { t } = useBuilderTranslation();

  if (!valueList) {
    return null;
  }

  return (
    <Box mt={2}>
      <Typography variant="body1" id={buildCategorySelectionTitleId(title)}>
        {title}
      </Typography>
      <Autocomplete
        sx={{ width: 'auto', maxWidth: '85%' }}
        disabled={!valueList}
        multiple
        disableClearable
        id={buildCategorySelectionId(title)}
        value={valueList?.filter((value) => selectedValues.includes(value))}
        options={valueList}
        getOptionLabel={(option) => option.name}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="outlined"
            placeholder={t(BUILDER.DROP_DOWN_PLACEHOLDER)}
          />
        )}
      />
    </Box>
  );
};

export default DropdownMenu;
