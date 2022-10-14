import { AutocompleteChangeReason, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import {
  CATEGORY_TYPES,
  CATEGORY_TYPE_TITLES,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import { Category } from '../../../config/types';
import { sortByName } from '../../../utils/item';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import DropdownMenu from './DropdownMenu';

const { useCategoryTypes, useCategories, useItemCategories } = hooks;
const { POST_ITEM_CATEGORY, DELETE_ITEM_CATEGORY } = MUTATION_KEYS;

const SELECT_OPTION = 'selectOption';
const REMOVE_OPTION = 'removeOption';

type Props = {
  item: Item;
};

const CategorySelection: FC<Props> = ({ item }) => {
  const { t } = useBuilderTranslation();
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
  const levelCategoryId = categoryTypes?.find(
    (type) => type.name === CATEGORY_TYPES.LEVEL,
  )?.id;
  const disciplineCategoryId = categoryTypes?.find(
    (type) => type.name === CATEGORY_TYPES.DISCIPLINE,
  )?.id;
  const languageCategoryId = categoryTypes?.find(
    (type) => type.name === CATEGORY_TYPES.LANGUAGE,
  )?.id;
  // todo
  let levelList: any[] = [];
  let disciplineList: any[] = [];
  let languageList: any[] = [];

  if (categoriesMap) {
    if (levelCategoryId) {
      levelList = categoriesMap.get(levelCategoryId)?.toArray() || [];
    }

    if (disciplineCategoryId) {
      disciplineList =
        categoriesMap.get(disciplineCategoryId)?.toArray().sort(sortByName) ||
        [];
    }

    if (languageCategoryId) {
      languageList = categoriesMap.get(languageCategoryId)?.toArray() || [];
    }
  }

  // initialize state variable
  const [selectedValues, setSelectedValues] = useState<Category[]>([]);

  // update state variables depending on fetch values
  useEffect(() => {
    if (itemCategories && allCategories)
      setSelectedValues(
        allCategories
          ?.filter((entry) =>
            itemCategories?.map((obj) => obj.categoryId).includes(entry.id),
          )
          .toArray(),
      );
  }, [item, itemCategories, allCategories]);

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
      _event: SyntheticEvent,
      value: Category[],
      reason: AutocompleteChangeReason,
    ) => {
      if (!itemId) {
        console.error('No item id is defined');
        return;
      }

      if (reason === SELECT_OPTION) {
        // post new category
        const newCategoryId = value[value.length - 1].id;
        createItemCategory({
          itemId,
          categoryId: newCategoryId,
        });
      } else if (reason === REMOVE_OPTION) {
        // remove an option
        const previousValues = valueList?.filter((entry) =>
          selectedValues.includes(entry),
        );
        const result = previousValues.filter(
          ({ id: id1 }) => !value.some(({ id: id2 }) => id2 === id1),
        );
        const deletedEntry = itemCategories?.find(
          (entry) => entry.categoryId === result[0].id,
        );
        if (deletedEntry) {
          deleteItemCategory({
            itemId,
            itemCategoryId: deletedEntry.id,
          });
        }
      }
    };

  return (
    <Box mt={2}>
      <Typography variant="h6" mt={2}>
        {t(BUILDER.ITEM_CATEGORIES_SELECTION_TITLE)}
      </Typography>
      <DropdownMenu
        title={t(CATEGORY_TYPE_TITLES.LEVEL)}
        handleChange={handleChange(levelList)}
        valueList={levelList}
        selectedValues={selectedValues}
      />
      <DropdownMenu
        title={t(CATEGORY_TYPE_TITLES.DISCIPLINE)}
        handleChange={handleChange(disciplineList)}
        valueList={disciplineList}
        selectedValues={selectedValues}
      />
      <DropdownMenu
        title={t(CATEGORY_TYPE_TITLES.LANGUAGE)}
        handleChange={handleChange(languageList)}
        valueList={languageList}
        selectedValues={selectedValues}
      />
    </Box>
  );
};

export default CategorySelection;
