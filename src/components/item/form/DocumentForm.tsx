import { useEffect, useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  TextField,
} from '@mui/material';

import {
  DocumentItemExtraFlavor,
  DocumentItemExtraProperties,
  DocumentItemType,
  ItemType,
  buildDocumentExtra,
} from '@graasp/sdk';
import { withFlavor } from '@graasp/ui';
import TextEditor from '@graasp/ui/text-editor';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  FLAVOR_SELECT_ID,
  ITEM_FORM_DOCUMENT_TEXT_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import DisplayNameForm from './DisplayNameForm';
import type { EditModalContentPropType } from './EditModalWrapper';
import NameForm from './NameForm';

enum EditorMode {
  Rich,
  Raw,
}

export const DocumentExtraForm = ({
  documentItemId,
  extra,
  onCancel,
  onContentChange,
  onFlavorChange,
  onEditorChange,
  placeholder,
}: {
  documentItemId?: string;
  extra: DocumentItemExtraProperties;
  onCancel?: () => void;
  onContentChange?: (text: string) => void;
  onFlavorChange?: (text: DocumentItemExtraProperties['flavor']) => void;
  onEditorChange?: (isRaw: DocumentItemExtraProperties['isRaw']) => void;
  placeholder?: string;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const [editorMode, setEditorMode] = useState(
    extra.isRaw ? EditorMode.Raw.toString() : EditorMode.Rich.toString(),
  );
  const flavorsTranslations = Object.values(DocumentItemExtraFlavor).map(
    (f) => [
      f,
      t(
        BUILDER[
          `DOCUMENT_FLAVOR_${f.toUpperCase() as Uppercase<`${DocumentItemExtraFlavor}`>}`
        ],
      ),
    ],
  );

  const getFlavorColor = (flavor: DocumentItemExtraFlavor) => {
    switch (flavor) {
      // TODO: apply color through theme settings
      case DocumentItemExtraFlavor.Info:
        return '#E5F6FD';
      case DocumentItemExtraFlavor.Error:
        return '#FDEDED';
      case DocumentItemExtraFlavor.Success:
        return '#EDF7ED';
      case DocumentItemExtraFlavor.Warning:
        return '#FFF4E5';
      default:
        return null;
    }
  };

  const handleChangeEditorMode = (mode: string) => {
    // send editor mode change
    onEditorChange?.(mode === EditorMode.Raw.toString());
    setEditorMode(mode);
  };

  return (
    <Stack direction="column" spacing={1} minHeight={0}>
      <Box sx={{ width: '100%' }}>
        <FormControl variant="standard" sx={{ width: '100%', my: 1 }}>
          <InputLabel shrink id={FLAVOR_SELECT_ID}>
            {t(BUILDER.DOCUMENT_FLAVOR_SELECT_LABEL)}
          </InputLabel>
          <Select
            id={FLAVOR_SELECT_ID}
            variant="standard"
            label="flavor"
            value={extra.flavor ?? ''}
            onChange={({ target: { value } }) => {
              onFlavorChange?.(value as `${DocumentItemExtraFlavor}`);
            }}
          >
            {flavorsTranslations.map(([f, name]) => (
              <MenuItem
                key={f}
                value={f}
                sx={{
                  backgroundColor: getFlavorColor(f as DocumentItemExtraFlavor),
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TabContext value={editorMode.toString()}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(_, value) => handleChangeEditorMode(value)}
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
                value={extra.content}
                onCancel={onCancel}
                onChange={onContentChange}
                placeholderText={placeholder}
                showActions={false}
              />
            ),
            flavor: extra.flavor,
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
                value={extra.content}
                onChange={({ target: { value } }) => onContentChange?.(value)}
              />
            ),
            flavor: extra.flavor,
          })}
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

const DocumentForm = ({
  setChanges,
  item,
  updatedProperties,
}: EditModalContentPropType): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  // we cast the properties here to match the generic component EditModalContentType
  const typedUpdatedProperties = updatedProperties as Partial<DocumentItemType>;
  const typedItem = item as DocumentItemType;

  const initContent: string =
    typedUpdatedProperties?.extra?.[ItemType.DOCUMENT]?.content ||
    typedItem?.extra?.[ItemType.DOCUMENT]?.content ||
    '';

  const initFlavor: DocumentItemExtraProperties['flavor'] =
    typedUpdatedProperties?.extra?.[ItemType.DOCUMENT]?.flavor ||
    typedItem?.extra?.[ItemType.DOCUMENT]?.flavor;

  const initIsRaw: DocumentItemExtraProperties['isRaw'] =
    typedUpdatedProperties?.extra?.[ItemType.DOCUMENT]?.isRaw ||
    typedItem?.extra?.[ItemType.DOCUMENT]?.isRaw;

  const [content, setContent] =
    useState<DocumentItemExtraProperties['content']>(initContent);
  const [flavor, setFlavor] =
    useState<DocumentItemExtraProperties['flavor']>(initFlavor);
  const [isRaw, setIsRaw] =
    useState<DocumentItemExtraProperties['isRaw']>(initIsRaw);
  const currentExtra = buildDocumentExtra({ content, flavor, isRaw });

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      extra: currentExtra,
    });
    // we only want to execute the state sync on local state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, flavor, isRaw]);

  return (
    <Box id="document" display="flex" flexDirection="column" minHeight="0px">
      <Box display="flex" flexDirection="row" sx={{ gap: '10px' }}>
        <NameForm
          setChanges={setChanges}
          item={item}
          required
          updatedProperties={updatedProperties}
        />
        <DisplayNameForm
          setChanges={setChanges}
          item={item}
          updatedProperties={updatedProperties}
        />
      </Box>
      <DocumentExtraForm
        documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
        extra={currentExtra.document}
        onContentChange={setContent}
        onFlavorChange={setFlavor}
        onEditorChange={setIsRaw}
        placeholder={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
      />
    </Box>
  );
};

export default DocumentForm;
