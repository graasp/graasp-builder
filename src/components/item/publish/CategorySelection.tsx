import { SyntheticEvent } from 'react';
import { useParams } from 'react-router';

import { AutocompleteChangeReason, Box, Typography } from '@mui/material';

import { routines } from '@graasp/query-client';
import { Category, CategoryType } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import groupBy from 'lodash.groupby';

import {
  useBuilderTranslation,
  useCategoriesTranslation,
} from '../../../config/i18n';
import notifier from '../../../config/notifier';
import { hooks, mutations } from '../../../config/queryClient';
import { LIBRARY_SETTINGS_CATEGORIES_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { sortByName } from '../../../utils/item';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import DropdownMenu from './DropdownMenu';

const { postItemCategoryRoutine } = routines;

const { useCategories, useItemCategories } = hooks;
const { usePostItemCategory, useDeleteItemCategory } = mutations;

const SELECT_OPTION = 'selectOption';
const REMOVE_OPTION = 'removeOption';

type Props = {
  disabled: boolean;
};

const CategorySelection = ({ disabled }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCategories } = useCategoriesTranslation();
  const { mutate: createItemCategory } = usePostItemCategory();
  const { mutate: deleteItemCategory } = useDeleteItemCategory();

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  // current item
  const { itemId } = useParams();

  // get itemCategories, categoryTypes and allCategories
  const { data: itemCategories, isLoading: isItemCategoriesLoading } =
    useItemCategories(itemId);
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories();

  // process data
  const categoriesMap = groupBy(allCategories, (entry) => entry.type);

  if (isMemberLoading || isItemCategoriesLoading || isCategoriesLoading) {
    return <Loader />;
  }

  if (!Object.values(categoriesMap).length) {
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
      if (!newCategoryId) {
        notifier({
          type: postItemCategoryRoutine.FAILURE,
          payload: { error: new Error(FAILURE_MESSAGES.UNEXPECTED_ERROR) },
        });
      } else {
        createItemCategory({
          itemId,
          categoryId: newCategoryId,
        });
      }
    }
    if (reason === REMOVE_OPTION) {
      const deletedCategoryId = details?.option.id;
      const itemCategoryIdToDelete = itemCategories?.find(
        ({ category }) => category.id === deletedCategoryId,
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
        {translateBuilder(BUILDER.ITEM_CATEGORIES_SELECTION_TITLE)}
      </Typography>
      {Object.values(CategoryType)?.map((type) => {
        const values =
          categoriesMap[type]
            ?.map((c: Category) => ({
              ...c,
              name: translateCategories(c.name),
            }))
            ?.sort(sortByName) ?? [];

        return (
          <DropdownMenu
            key={type}
            disabled={disabled}
            title={translateCategories(type)}
            handleChange={handleChange}
            values={values}
            selectedValues={itemCategories}
            type={type}
          />
        );
      })}
    </Box>
  );
};

export default CategorySelection;
