import { Controller, useFormContext } from 'react-hook-form';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, TextField, Typography } from '@mui/material';

import { DocumentItemExtraFlavor } from '@graasp/sdk';
import { withFlavor } from '@graasp/ui';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { EditorMode } from './EditorMode.enum';

export type DocumentExtraFormInputs = {
  content: string;
};

export const DocumentContentForm = ({
  documentItemId,
  placeholder,
  // content value to pass to text editor
  // set value to pass to text editor
  onChange,
}: {
  documentItemId?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<{
    content: string;
    isRaw: boolean;
    flavor: `${DocumentItemExtraFlavor}`;
  }>();

  const isRaw = watch('isRaw');
  const content = watch('content');
  const flavor = watch('flavor');

  return (
    <TabContext
      value={isRaw ? EditorMode.Raw.toString() : EditorMode.Rich.toString()}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Controller
          name="isRaw"
          control={control}
          render={({ field }) => (
            <TabList
              onChange={(_, mode) => {
                field.onChange(mode === EditorMode.Raw.toString());
              }}
              aria-label={t(BUILDER.DOCUMENT_EDITOR_MODE_ARIA_LABEL)}
              centered
              variant="fullWidth"
            >
              <Tab
                label={t(BUILDER.DOCUMENT_EDITOR_MODE_RICH_TEXT)}
                value={EditorMode.Rich.toString()}
              />
              <Tab
                label={t(BUILDER.DOCUMENT_EDITOR_MODE_RAW)}
                value={EditorMode.Raw.toString()}
              />
            </TabList>
          )}
        />
      </Box>

      <TabPanel value={EditorMode.Rich.toString()}>
        {withFlavor({
          content: (
            <TextEditor
              id={documentItemId}
              value={content}
              onChange={onChange}
              placeholderText={placeholder}
              showActions={false}
            />
          ),
          flavor,
        })}
      </TabPanel>
      <TabPanel value={EditorMode.Raw.toString()} sx={{ minHeight: '0px' }}>
        {withFlavor({
          content: (
            <TextField
              multiline
              fullWidth
              minRows={5}
              maxRows={25}
              {...register('content', {
                required: t(BUILDER.DOCUMENT_EMPTY_MESSAGE),
                minLength: 1,
              })}
            />
          ),
          flavor,
        })}
      </TabPanel>
      <Typography variant="caption" color="error">
        {errors?.content?.message}
      </Typography>
    </TabContext>
  );
};
