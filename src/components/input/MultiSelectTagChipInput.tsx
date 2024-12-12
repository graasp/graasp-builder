import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';

import { DiscriminatedItem, TagCategory } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  MULTI_SELECT_CHIP_CONTAINER_ID,
  buildMultiSelectChipInputId,
  buildMultiSelectChipsSelector,
} from '@/config/selectors';

import useTagsManager from '../item/publish/customizedTags/useTagsManager';

type Props = {
  itemId: DiscriminatedItem['id'];
  tagCategory: TagCategory;
  helpertext?: string;
};

export const MultiSelectTagChipInput = ({
  itemId,
  tagCategory,
  helpertext,
}: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const {
    currentValue,
    error,
    handleCurrentValueChanged,
    addValue,
    deleteValue,
    resetCurrentValue,
    debouncedCurrentValue,
    tagsPerCategory,
  } = useTagsManager({
    itemId,
  });
  const {
    data: tags,
    isFetching,
    isLoading,
  } = hooks.useTags({ search: debouncedCurrentValue, category: tagCategory });
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
          onDelete={() => {
            const tagId = tagsPerCategory?.[tagCategory].find(
              ({ name }) => name === option,
            );
            if (tagId) {
              deleteValue(tagId.id);
            }
          }}
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
      // show plural version
      label={translateEnums(tagCategory, { count: 2 })}
      slotProps={{
        htmlInput: {
          ...params.inputProps,
          value: currentValue,
        },
      }}
      helperText={helpertext}
      sx={{
        // Avoid to resize the textfield on hover when next tag will be on new line.
        '& .MuiAutocomplete-input': {
          minWidth: '30px !important',
        },
      }}
      onChange={(e) => handleCurrentValueChanged(e.target.value, tagCategory)}
      onKeyDown={(e) => {
        if (e.code === 'Enter' && 'value' in e.target) {
          addValue({ name: e.target.value as string, category: tagCategory });
        }
      }}
    />
  );

  const options =
    tags
      ?.filter(({ category }) => category === tagCategory)
      ?.map(({ name }) => name) ?? [];

  return (
    <Stack mt={1} spacing={1}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Autocomplete
          data-cy={buildMultiSelectChipInputId(tagCategory)}
          fullWidth
          multiple
          filterSelectedOptions
          // allows to hide empty "add option" text on adding a new tag
          freeSolo={!currentValue}
          onBlur={resetCurrentValue}
          noOptionsText={
            error ?? (
              <Button
                fullWidth
                onClick={() =>
                  addValue({
                    name: currentValue,
                    category: tagCategory,
                  })
                }
              >
                {t('ADD_TAG_OPTION_BUTTON_TEXT', { value: currentValue })}
              </Button>
            )
          }
          options={options}
          value={tagsPerCategory?.[tagCategory]?.map(({ name }) => name) ?? []}
          onChange={(_e, v) => {
            if (v.length) {
              addValue({
                name: v[v.length - 1],
                category: tagCategory,
              });
            }
          }}
          renderTags={renderTags}
          renderOption={(optionProps, name) => (
            <Box component="li" {...optionProps}>
              {name}
            </Box>
          )}
          renderInput={renderInput}
          disableClearable
          loading={
            isFetching || isLoading || debouncedCurrentValue !== currentValue
          }
          loadingText={<Skeleton />}
        />
      </Stack>
    </Stack>
  );
};
