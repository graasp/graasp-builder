import { useEffect, useState } from 'react';

import { Chip, Stack, TextField, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Loader, SaveButton } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  ITEM_TAGS_EDIT_INPUT_ID,
  ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID,
  buildCustomizedTagsSelector,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { useCurrentUserContext } from '../../context/CurrentUserContext';

type Props = { item: DiscriminatedItem; disabled?: boolean };

const CustomizedTagsEdit = ({ item, disabled }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { mutate: updateCustomizedTags } = mutations.useEditItem();

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  const settings = item?.settings;
  const itemId = item?.id;

  const [displayValues, setDisplayValues] = useState<string>();

  useEffect(() => {
    if (settings) {
      setDisplayValues(settings.tags?.join(', '));
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange: TextFieldProps['onChange'] = (event) => {
    setDisplayValues(event.target.value);
  };

  const handleSubmit = () => {
    const tagsList =
      displayValues
        ?.split(', ')
        ?.map((entry) => entry.trim())
        ?.filter(Boolean) || [];
    updateCustomizedTags({
      id: itemId,
      settings: { tags: tagsList },
    });
  };

  return (
    <>
      <Typography variant="h6" mt={2}>
        {translateBuilder(BUILDER.ITEM_TAGS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_TAGS_INFORMATION)}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack flexGrow={1}>
          <TextField
            variant="outlined"
            multiline
            maxRows={5}
            defaultValue={displayValues}
            onChange={handleChange}
            id={ITEM_TAGS_EDIT_INPUT_ID}
            sx={{ mt: 1, mb: 1 }}
            disabled={disabled}
            fullWidth
            placeholder={translateBuilder(BUILDER.ITEM_TAGS_PLACEHOLDER)}
          />
        </Stack>
        <Stack>
          <SaveButton
            onClick={handleSubmit}
            id={ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID}
            text={translateCommon(COMMON.SAVE_BUTTON)}
            hasChanges={!disabled}
          />
        </Stack>
      </Stack>
      {settings?.tags?.length && (
        <>
          <Typography variant="caption">
            {translateBuilder(BUILDER.ITEM_TAGS_PREVIEW_TITLE)}
          </Typography>
          <br />
          <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
            {settings?.tags?.map((tag, index) => (
              <Chip
                key={tag}
                label={tag}
                id={buildCustomizedTagsSelector(index)}
              />
            ))}
          </Stack>
        </>
      )}
    </>
  );
};

export default CustomizedTagsEdit;
