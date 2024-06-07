import { SyntheticEvent } from 'react';

import { AutocompleteChangeReason, Stack } from '@mui/material';

import { Category, CategoryType } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import groupBy from 'lodash.groupby';

import { useCategoriesTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { Filter } from '@/types/array';
import { sortByName } from '@/utils/item';

import DropdownMenu from './DropdownMenu';

const { useCategories, useItemCategories } = hooks;

const SELECT_OPTION = 'selectOption';
const REMOVE_OPTION = 'removeOption';

type Props = {
  itemId: string;
  titleContent?: JSX.Element;
  filterCategories?: Filter<Category>;
  onCreate: (categoryId: string) => void;
  onDelete: (itemCategoryId: string) => void;
};
const CategorySelection = ({
  itemId,
  titleContent,
  filterCategories = () => true,
  onCreate,
  onDelete,
}: Props): JSX.Element | null => {
  const { t: translateCategories } = useCategoriesTranslation();
  const { data: itemCategories, isLoading: isItemCategoriesLoading } =
    useItemCategories(itemId);
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories();
  const isLoading = isItemCategoriesLoading || isCategoriesLoading;
  const filteredCategories = allCategories?.filter(filterCategories);
  const categoriesByType = groupBy(filteredCategories, (entry) => entry.type);

  if (isLoading) {
    return (
      <Stack alignItems="center">
        <Loader />
      </Stack>
    );
  }

  if (!Object.values(categoriesByType).length) {
    return null;
  }

  const handleChange = (
    _event: SyntheticEvent,
    _values: Category[],
    reason: AutocompleteChangeReason,
    details?: { option: Category },
  ) => {
    if (!itemId) {
      console.error('No item id is defined');
      return;
    }

    if (reason === SELECT_OPTION) {
      // post new category
      const newCategoryId = details?.option.id;
      if (newCategoryId) {
        onCreate(newCategoryId);
      } else {
        console.error('Unable to create the category!');
      }
    }
    if (reason === REMOVE_OPTION) {
      const deletedCategoryId = details?.option.id;
      const itemCategoryIdToRemove = itemCategories?.find(
        ({ category }) => category.id === deletedCategoryId,
      )?.id;
      if (itemCategoryIdToRemove) {
        onDelete(itemCategoryIdToRemove);
      } else {
        console.error('Unable to delete the category!');
      }
    }
  };

  return (
    <Stack>
      {titleContent}
      {Object.values(CategoryType)?.map((type) => {
        const values =
          categoriesByType[type]
            ?.map((c: Category) => ({
              ...c,
              name: translateCategories(c.name),
            }))
            ?.sort(sortByName) ?? [];

        return (
          <DropdownMenu
            key={type}
            title={translateCategories(type)}
            handleChange={handleChange}
            values={values}
            selectedValues={itemCategories}
            type={type}
          />
        );
      })}
    </Stack>
  );
};

export default CategorySelection;
