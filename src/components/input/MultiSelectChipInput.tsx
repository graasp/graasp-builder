import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Box,
  Chip,
  Fab,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import {
  MULTI_SELECT_CHIP_ADD_BUTTON_ID,
  MULTI_SELECT_CHIP_CONTAINER_ID,
  MULTI_SELECT_CHIP_INPUT_ID,
  buildMultiSelectChipsSelector,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { useMultiSelectChipInput } from './MultiSelectChipInput.hook';

type Props = {
  data?: string[];
  label: string;
  onSave: (newValues: string[]) => void;
};

export const MultiSelectChipInput = ({
  data,
  label,
  onSave,
}: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const {
    values,
    currentValue,
    error,
    hasError,
    updateValues,
    handleCurrentValueChanged,
    addValue,
  } = useMultiSelectChipInput({
    data,
    onChange: onSave,
  });

  const renderTags = (
    value: readonly string[],
    getTagProps: AutocompleteRenderGetTagProps,
  ) => (
    <Box data-cy={MULTI_SELECT_CHIP_CONTAINER_ID}>
      {value.map((option: string, index: number) => (
        <Chip
          data-cy={buildMultiSelectChipsSelector(index)}
          variant="outlined"
          label={option}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getTagProps({ index })}
          key={option}
        />
      ))}
    </Box>
  );

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...params}
      variant="outlined"
      label={label}
      helperText={t(BUILDER.ITEM_TAGS_HELPER_TEXT)}
      inputProps={{
        ...params.inputProps,
        value: currentValue,
      }}
      error={hasError}
      sx={{
        // Avoid to resize the textfield on hover when next tag will be on new line.
        '& .MuiAutocomplete-input': {
          minWidth: '30px !important',
        },
      }}
    />
  );

  return (
    <Stack mt={1} spacing={1}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Autocomplete
          data-cy={MULTI_SELECT_CHIP_INPUT_ID}
          fullWidth
          multiple
          freeSolo
          options={[]}
          value={values}
          onChange={(_e, v) => updateValues(v)}
          inputValue={currentValue}
          onInputChange={(_e, v) => handleCurrentValueChanged(v)}
          renderTags={renderTags}
          renderInput={renderInput}
        />
        <Fab
          data-cy={MULTI_SELECT_CHIP_ADD_BUTTON_ID}
          variant="circular"
          color="primary"
          size="small"
          onClick={addValue}
          disabled={hasError || !currentValue}
          sx={{
            flexShrink: 0,
          }}
        >
          <AddIcon />
        </Fab>
      </Stack>
      {error && (
        <Typography pl={1} color="error" fontSize="small" fontStyle="italic">
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default MultiSelectChipInput;
