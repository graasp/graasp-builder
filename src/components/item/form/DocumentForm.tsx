import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';

import {
  DocumentItemExtra,
  DocumentItemExtraProperties,
  Item,
  ItemType,
} from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { DocumentItem } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';
import { buildDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';

export const DocumentExtraForm = ({
  documentItemId,
  extra,
  maxHeight,
  onCancel,
  onContentChange,
  onContentSave,
  onFlavorChange,
  placeholder,
  saveButtonId,
  showActions = false,
}: {
  documentItemId?: string;
  extra: DocumentItemExtraProperties;
  maxHeight?: string;
  onCancel?: () => void;
  onContentChange?: (text: string) => void;
  onContentSave?: (text: string) => void;
  onFlavorChange?: (text: DocumentItemExtraProperties['flavor']) => void;
  placeholder?: string;
  saveButtonId?: string;
  showActions?: boolean;
}): JSX.Element => (
  <>
    <Box sx={{ width: '100%' }}>
      <FormControl variant="standard" sx={{ width: '50%', my: 1 }}>
        <InputLabel shrink>Flavor</InputLabel>
        <Select
          variant="standard"
          label="flavor"
          value={extra.flavor}
          onChange={(event) =>
            onFlavorChange(
              event.target.value === ''
                ? undefined
                : (event.target.value as DocumentItemExtraProperties['flavor']),
            )
          }
        >
          <MenuItem value="">None</MenuItem>
          {['info', 'warning', 'error', 'success'].map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ mt: 2 }}>
      <DocumentItem
        edit
        id={documentItemId}
        item={{ extra: buildDocumentExtra(extra) }}
        maxHeight={maxHeight}
        onCancel={onCancel}
        onChange={onContentChange}
        onSave={onContentSave}
        placeholderText={placeholder}
        saveButtonId={saveButtonId}
        showActions={showActions}
      />
    </Box>
  </>
);

type Props = {
  onChange: (item: Partial<Item>) => void;
  item: Partial<Item>;
  updatedProperties: Partial<Item>;
};

const DocumentForm = ({
  onChange,
  item,
  updatedProperties,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const initContent: string =
    updatedProperties?.extra?.[ItemType.DOCUMENT]?.content ||
    item?.extra?.[ItemType.DOCUMENT]?.content;

  const initFlavor: DocumentItemExtraProperties['flavor'] =
    updatedProperties?.extra?.[ItemType.DOCUMENT]?.flavor ||
    item?.extra?.[ItemType.DOCUMENT]?.flavor;

  const [content, setContent] =
    useState<DocumentItemExtraProperties['content']>(initContent);
  const [flavor, setFlavor] =
    useState<DocumentItemExtraProperties['flavor']>(initFlavor);

  const currentExtra = buildDocumentExtra({ content, flavor });

  // synchronize upper state after async local state change
  useEffect(() => {
    onChange({
      ...updatedProperties,
      extra: currentExtra,
    });
    // we only want to execute the state sync on local state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, flavor]);

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.CREATE_NEW_ITEM_DOCUMENT_TITLE)}
      </Typography>
      <Box>
        <BaseForm
          onChange={onChange}
          item={item}
          updatedProperties={updatedProperties}
        />
      </Box>
      <DocumentExtraForm
        documentItemId={ITEM_FORM_DOCUMENT_TEXT_ID}
        extra={currentExtra.document}
        onContentChange={setContent}
        onFlavorChange={setFlavor}
        placeholder={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
      />
    </>
  );
};

export default DocumentForm;
