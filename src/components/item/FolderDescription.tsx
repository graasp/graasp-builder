import { FC } from 'react';

import { BUILDER } from '@graasp/translations';
import { TextEditor } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import { buildSaveButtonId } from '../../config/selectors';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
  isEditing?: boolean;
};

const FolderDescription: FC<Props> = ({ itemId, isEditing = false }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editItem } = mutations.useEditItem();
  const { setEditingItemId } = useLayoutContext();
  const { data: parentItem } = hooks.useItem(itemId);

  const onDescriptionSave = (str: string) => {
    let description = str;
    // check that the content is just empty
    // this is added by quills internal model based on deltas https://quilljs.com/docs/delta/
    if (str === '<p><br></p>') {
      description = '';
    }
    editItem({ id: itemId, description });
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
