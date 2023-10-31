import { useEffect, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';

import {
  DocumentItemExtraFlavor,
  DocumentItemExtraProperties,
  DocumentItemType,
  ItemType,
} from '@graasp/sdk';
import { DocumentItem } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { buildDocumentExtra } from '../../../utils/itemExtra';
import type { EditModalContentPropType } from './EditModalWrapper';
import NameForm from './NameForm';

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
  cancelButtonId,
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
  cancelButtonId?: string;
  showActions?: boolean;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const flavorsTranslations = Object.values(DocumentItemExtraFlavor).map(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (f) => [f, t(BUILDER[`DOCUMENT_FLAVOR_${f.toUpperCase()}`])],
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <FormControl variant="standard" sx={{ width: '50%', my: 1 }}>
          <InputLabel shrink>Flavor</InputLabel>
          <Select
            variant="standard"
            label="flavor"
            value={extra.flavor}
            onChange={(event) =>
              onFlavorChange?.(
                event.target.value === ''
                  ? undefined
                  : (event.target
                      .value as DocumentItemExtraProperties['flavor']),
              )
            }
          >
            <MenuItem value="">None</MenuItem>
            {flavorsTranslations.map(([f, name]) => (
              <MenuItem key={f} value={f}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2 }}>
        <DocumentItem
          edit
          id={documentItemId}
          item={{
            extra: buildDocumentExtra(extra),
          }}
          maxHeight={maxHeight}
          onCancel={onCancel}
          onChange={onContentChange}
          onSave={onContentSave}
          placeholderText={placeholder}
          saveButtonId={saveButtonId}
          cancelButtonId={cancelButtonId}
          showActions={showActions}
        />
      </Box>
    </>
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

  const [content, setContent] =
    useState<DocumentItemExtraProperties['content']>(initContent);
  const [flavor, setFlavor] =
    useState<DocumentItemExtraProperties['flavor']>(initFlavor);

  const currentExtra = buildDocumentExtra({ content, flavor });

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      extra: currentExtra,
    });
    // we only want to execute the state sync on local state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, flavor]);

  return (
    <>
      <Box>
        <NameForm
          setChanges={setChanges}
          item={item}
          required
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
