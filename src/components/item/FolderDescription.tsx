import { TextEditor } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { buildSaveButtonId } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId?: string;
};

const FolderDescription = ({ itemId }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: parentItem } = hooks.useItem(itemId);

  if (!itemId) {
    return null;
  }

  return (
    <TextEditor
      value={parentItem?.description ?? ''}
      placeholderText={translateBuilder(
        BUILDER.EDIT_FOLDER_DESCRIPTION_PLACEHOLDER,
      )}
      showActions
      saveButtonId={buildSaveButtonId(itemId)}
    />
  );
};

export default FolderDescription;
