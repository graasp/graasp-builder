import { List } from 'immutable';

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
  buildCategorySelectionOptionId,
  buildCategorySelectionTitleId,
} from '../../../config/selectors';
import { Category, ItemCategory } from '../../../config/types';

type Props = {
  typeId: string;
  title: string;
  valueList: Category[];
  selectedValues: List<ItemCategory>;
  handleChange: (
    _event: SyntheticEvent,
    value: Category[],
    reason: AutocompleteChangeReason,
  ) => void;
};

const DropdownMenu: FC<Props> = ({
  typeId,
  title,
  handleChange,
  valueList,
  selectedValues,
}) => {
  const { t } = useBuilderTranslation();

  if (!valueList) {
    return null;
  }

  const values = valueList.filter(({ id }) =>
    selectedValues.find(({ categoryId }) => categoryId === id),
  );

  return (
    <Box mt={2}>
      <Typography variant="body1" id={buildCategorySelectionTitleId(typeId)}>
        {title}
      </Typography>
      <Autocomplete
        sx={{ width: 'auto', maxWidth: '85%' }}
        disabled={!valueList}
        multiple
        disableClearable
        id={buildCategorySelectionId(typeId)}
        value={values}
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
        renderOption={(props: unknown, option: Category) => (
          <li
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            // necessary for test
            data-id={option.id}
            id={buildCategorySelectionOptionId(typeId, option.id)}
          >
            {option.name}
          </li>
        )}
      />
    </Box>
  );
};

export default DropdownMenu;
