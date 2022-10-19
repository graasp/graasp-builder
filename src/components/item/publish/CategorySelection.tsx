import { AutocompleteChangeReason, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { FC, SyntheticEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER, namespaces } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import { LIBRARY_SETTINGS_CATEGORIES_ID } from '../../../config/selectors';
import { Category } from '../../../config/types';
import { sortByName } from '../../../utils/item';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import DropdownMenu from './DropdownMenu';

const { useCategoryTypes, useCategories, useItemCategories } = hooks;
const { POST_ITEM_CATEGORY, DELETE_ITEM_CATEGORY } = MUTATION_KEYS;

const SELECT_OPTION = 'selectOption';
const REMOVE_OPTION = 'removeOption';

const CategorySelection: FC = () => {
  const { t } = useBuilderTranslation();
  const { t: categoriesT } = useTranslation(namespaces.categories);
  const { mutate: createItemCategory } = useMutation<
    any,
    any,
    {
      itemId: string;
      categoryId: string;
    }
  >(POST_ITEM_CATEGORY);
  const { mutate: deleteItemCategory } = useMutation<
    any,
    any,
    {
      itemId: string;
      itemCategoryId: string;
    }
  >(DELETE_ITEM_CATEGORY);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  // get itemCategories, categoryTypes and allCategories
  const { data: itemCategories, isLoading: isItemCategoriesLoading } =
    useItemCategories(itemId);
  const { data: categoryTypes, isLoading: isCategoryTypesLoading } =
    useCategoryTypes();
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories();

  // process data
  const categoriesMap = allCategories?.groupBy((entry) => entry.type);

  if (
    isMemberLoading ||
    isItemCategoriesLoading ||
    isCategoryTypesLoading ||
    isCategoriesLoading
  ) {
    return <Loader />;
  }

  const handleChange =
    (valueList: Category[]) =>
    (
      event: SyntheticEvent,
      _values: Category[],
      reason: AutocompleteChangeReason,
    ) => {
      if (!itemId) {
        console.error('No item id is defined');
        return;
      }

      if (reason === SELECT_OPTION) {
        // post new category
        const newCategoryId = event.target.getAttribute('data-id');
        createItemCategory({
          itemId,
          categoryId: newCategoryId,
        });
      } else if (reason === REMOVE_OPTION) {
        const deletedCategoryId = event.target.getAttribute('data-id');
        const itemCategoryIdToDelete = itemCategories.find(
          ({ categoryId }) => categoryId === deletedCategoryId,
        )?.id;
        if (itemCategoryIdToDelete) {
          deleteItemCategory({
            itemId,
            itemCategoryId: itemCategoryIdToDelete,
          });
        }
      }
    };

  return (
    <Box mt={2} id={LIBRARY_SETTINGS_CATEGORIES_ID}>
      <Typography variant="h6" mt={2}>
        {t(BUILDER.ITEM_CATEGORIES_SELECTION_TITLE)}
      </Typography>
      {categoryTypes?.map(({ id, name }) => {
        const values =
          categoriesMap
            ?.get(id)
            ?.toJS()
            ?.map((c) => ({ ...c, name: categoriesT(c.name) }))
            ?.sort(sortByName) ?? [];

        return (
          <DropdownMenu
            key={id}
            title={categoriesT(name)}
            handleChange={handleChange(values)}
            values={values}
            selectedValues={itemCategories}
            typeId={id}
          />
        );
      })}
    </Box>
  );
};

export default CategorySelection;
