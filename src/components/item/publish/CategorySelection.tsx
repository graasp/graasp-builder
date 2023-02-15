import { AutocompleteChangeReason, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { FC, SyntheticEvent } from 'react';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Category } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCategoriesTranslation,
} from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import { LIBRARY_SETTINGS_CATEGORIES_ID } from '../../../config/selectors';
import { sortByName } from '../../../utils/item';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import DropdownMenu from './DropdownMenu';

const { useCategoryTypes, useCategories, useItemCategories } = hooks;
const { POST_ITEM_CATEGORY, DELETE_ITEM_CATEGORY } = MUTATION_KEYS;

const SELECT_OPTION = 'selectOption';
const REMOVE_OPTION = 'removeOption';

type Props = {
  disabled: boolean;
};

const CategorySelection: FC<Props> = ({ disabled }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCategories } = useCategoriesTranslation();
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
  const { isLoading: isMemberLoading } = useCurrentUserContext();

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
    (_valueList: Category[]) =>
    (
      event: SyntheticEvent,
      _values: Category[],
      reason: AutocompleteChangeReason,
    ) => {
      if (!itemId) {
        console.error('No item id is defined');
        return;
      }

      const target = event.target as HTMLOptionElement;
      if (reason === SELECT_OPTION) {
        // post new category
        const newCategoryId = target.getAttribute('data-id');
        createItemCategory({
          itemId,
          categoryId: newCategoryId,
        });
      } else if (reason === REMOVE_OPTION) {
        const deletedCategoryId = target.getAttribute('data-id');
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
        {translateBuilder(BUILDER.ITEM_CATEGORIES_SELECTION_TITLE)}
      </Typography>
      {categoryTypes?.map(({ id, name }) => {
        let values = categoriesMap?.get(id)?.toJS() as Category[];

        values =
          values
            .map((c) => ({ ...c, name: translateCategories(c.name) }))
            ?.sort(sortByName) ?? ([] as Category[]);

        if (!values.length) {
          return null;
        }

        return (
          <DropdownMenu
            key={id}
            disabled={disabled}
            title={translateCategories(name)}
            handleChange={handleChange(values)}
            values={values}
            // todo: fix with query client
            selectedValues={itemCategories as any}
            typeId={id}
          />
        );
      })}
    </Box>
  );
};

export default CategorySelection;
