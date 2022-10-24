import { FC, useContext } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { TextEditor } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, useMutation } from '../../config/queryClient';
import { buildSaveButtonId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
  isEditing?: boolean;
};

const FolderDescription: FC<Props> = ({ itemId, isEditing = false }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editItem } = useMutation<
    any,
    any,
    { id: string; description: string }
  >(MUTATION_KEYS.EDIT_ITEM);
  const { setEditingItemId } = useContext(LayoutContext);
  const { data: parentItem } = hooks.useItem(itemId);

  const onDescriptionSave = (str: string) => {
    editItem({ id: itemId, description: str });
    setEditingItemId(null);
  };

  const onCancel = () => {
    setEditingItemId(null);
  };

  if (!itemId) {
    return null;
  }

  return (
    <TextEditor
      value={parentItem?.description}
      edit={isEditing}
      placeholderText={translateBuilder(
        BUILDER.EDIT_FOLDER_DESCRIPTION_PLACEHOLDER,
      )}
      showActions
      onSave={onDescriptionSave}
      saveButtonId={buildSaveButtonId(itemId)}
      onCancel={onCancel}
    />
  );
};

export default FolderDescription;
