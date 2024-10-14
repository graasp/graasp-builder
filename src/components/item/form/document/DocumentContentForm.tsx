import { Dispatch } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, TextField } from '@mui/material';

import {
  DocumentItemExtraFlavor,
  DocumentItemExtraProperties,
} from '@graasp/sdk';
import { withFlavor } from '@graasp/ui';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { EditorMode } from './EditorMode.enum';

export type DocumentExtraFormInputs = {
  content: string;
};

export const DocumentContentForm = ({
  contentForm,
  documentItemId,
  flavor = DocumentItemExtraFlavor.None,
  isRaw,
  setIsRaw,
  placeholder,
  // content value to pass to text editor
  content,
  // set value to pass to text editor
  onChange,
}: {
  content: string;
  contentForm: UseFormRegisterReturn;
  documentItemId?: string;
  flavor?: DocumentItemExtraProperties['flavor'];
  isRaw: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
  setIsRaw: Dispatch<boolean>;
}): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Stack direction="column" spacing={1} minHeight={0} marginTop={1}>
      <TabContext
        value={isRaw ? EditorMode.Raw.toString() : EditorMode.Rich.toString()}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(_, mode) => {
              setIsRaw(mode === EditorMode.Raw.toString());
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
                {...contentForm}
              />
            ),
            flavor,
          })}
        </TabPanel>
      </TabContext>
    </Stack>
  );
};
