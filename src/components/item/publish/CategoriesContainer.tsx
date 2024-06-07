import { Typography } from '@mui/material';

import { Category, CategoryType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { LIBRARY_SETTINGS_CATEGORIES_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemCategoryContainer from './ItemCategoryContainer';

type Props = {
  itemId: string;
};

const CHIP_COLOR = '#5050d2';
const SYNC_STATUS_KEY = 'PublishCategories';

export const CategoriesContainer = ({ itemId }: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();

  const filterOutLanguage = ({ type }: Category) =>
    type !== CategoryType.Language;

  const title = t(BUILDER.ITEM_CATEGORIES_CONTAINER_TITLE);
  const description = t(BUILDER.ITEM_CATEGORIES_CONTAINER_MISSING_WARNING);
  const emptyMessage = t(BUILDER.ITEM_CATEGORIES_CONTAINER_EMPTY_BUTTON);

  const modalTitle = (
    <Typography variant="h6">
      {t(BUILDER.ITEM_CATEGORIES_CONTAINER_TITLE)}
    </Typography>
  );

  return (
    <ItemCategoryContainer
      itemId={itemId}
      filterCategories={filterOutLanguage}
      dataSyncKey={SYNC_STATUS_KEY}
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      modalTitle={modalTitle}
      chipColor={CHIP_COLOR}
      dataTestId={LIBRARY_SETTINGS_CATEGORIES_ID}
    />
  );
};
export default CategoriesContainer;
