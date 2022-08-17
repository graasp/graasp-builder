import React, { useContext } from 'react';
import { TextEditor } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MUTATION_KEYS } from '@graasp/query-client';
import { buildSaveButtonId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';
import { useMutation, hooks } from '../../config/queryClient';

const FolderDescription = ({ itemId, isEditing }) => {
  const { t } = useTranslation();
  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const { setEditingItemId } = useContext(LayoutContext);
  const { data: parentItem } = hooks.useItem(itemId);

  const onDescriptionSave = (str) => {
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
      placeholderText={t('Write the folder decription here...')}
      showSaveButton
      onSave={onDescriptionSave}
      saveButtonId={buildSaveButtonId(itemId)}
      onCancel={onCancel}
    />
  );
};

FolderDescription.propTypes = {
  itemId: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
};

FolderDescription.defaultProps = {
  isEditing: false,
};

export default FolderDescription;
