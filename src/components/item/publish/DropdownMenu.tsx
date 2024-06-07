import { SyntheticEvent } from 'react';

import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  TextField,
  Typography,
} from '@mui/material';

import { Category, CategoryType, ItemCategory } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  buildCategoryDropdownParentSelector,
  buildCategorySelectionId,
  buildCategorySelectionOptionId,
  buildCategorySelectionTitleId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  disabled?: boolean;
  type: CategoryType;
  title: string;
  values: Category[];
  selectedValues?: ItemCategory[];
  handleChange: (
    _event: SyntheticEvent,
    value: Category[],
    reason: AutocompleteChangeReason,
    details?: { option: Category },
  ) => void;
};

const DropdownMenu = ({
  disabled = false,
  type,
  title,
  handleChange,
  values,
  selectedValues,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  if (!values.length) {
    return null;
  }

  const selected = values.filter(({ id }) =>
    selectedValues?.find(({ category }) => category.id === id),
  );

  return (
    <Box mt={2}>
      <Typography variant="body1" id={buildCategorySelectionTitleId(type)}>
        {title}
      </Typography>
      <Autocomplete
        data-cy={buildCategoryDropdownParentSelector(type)}
        sx={{ width: 'auto' }}
        disabled={disabled || !values}
        multiple
        disableClearable
        id={buildCategorySelectionId(type)}
        value={selected}
        options={values}
        getOptionLabel={(option: Category) => option.name}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="outlined"
            placeholder={translateBuilder(BUILDER.DROP_DOWN_PLACEHOLDER)}
          />
        )}
        renderOption={(props, option) => (
          <li
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            // necessary for test
            data-id={option.id}
            id={buildCategorySelectionOptionId(type, option.id)}
          >
            {option.name}
          </li>
        )}
      />
    </Box>
  );
};

export default DropdownMenu;
