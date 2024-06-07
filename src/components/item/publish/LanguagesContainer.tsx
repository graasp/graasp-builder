import { Category, CategoryType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { LIBRARY_SETTINGS_LANGUAGES_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemCategoryContainer from './ItemCategoryContainer';

type Props = {
  itemId: string;
};

const CHIP_COLOR = '#9a49de';
const SYNC_STATUS_KEY = 'PublishLanguage';

export const LanguagesContainer = ({ itemId }: Props): JSX.Element | null => {
  const keepLanguageOnly = ({ type }: Category) =>
    type === CategoryType.Language;

  const { t } = useBuilderTranslation();

  const title = t(BUILDER.ITEM_LANGUAGES_CONTAINER_TITLE);
  const description = t(BUILDER.ITEM_LANGUAGES_CONTAINER_MISSING_WARNING);
  const emptyMessage = t(BUILDER.ITEM_LANGUAGES_CONTAINER_EMPTY_BUTTON);

  return (
    <ItemCategoryContainer
      itemId={itemId}
      filterCategories={keepLanguageOnly}
      dataSyncKey={SYNC_STATUS_KEY}
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      chipColor={CHIP_COLOR}
      dataTestId={LIBRARY_SETTINGS_LANGUAGES_ID}
    />
  );
};
export default LanguagesContainer;
