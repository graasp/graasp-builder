import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import { Record } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import {
  CATEGORY_TYPES,
  CATEGORY_TYPE_TITLES,
} from '../../../config/constants';
import { sortByName } from '../../../utils/item';
import DropdownMenu from './DropdownMenu';

const { useCategoryTypes, useCategories, useItemCategories } = hooks;
const { POST_ITEM_CATEGORY, DELETE_ITEM_CATEGORY } = MUTATION_KEYS;

const SELECT_OPTION = 'select-option';
const REMOVE_OPTION = 'remove-option';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
  selection: {
    marginTop: theme.spacing(2),
  },
  dropMenu: {
    width: 'auto',
    maxWidth: '85%',
  },
}));

const CategorySelection = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: createItemCategory } = useMutation(POST_ITEM_CATEGORY);
  const { mutate: deleteItemCategory } = useMutation(DELETE_ITEM_CATEGORY);

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
  const levelList = categoriesMap
    ?.get(categoryTypes?.find((type) => type.name === CATEGORY_TYPES.LEVEL)?.id)
    ?.toArray();
  const disciplineList = categoriesMap
    ?.get(
      categoryTypes?.find((type) => type.name === CATEGORY_TYPES.DISCIPLINE)
        ?.id,
    )
    ?.toArray()
    .sort(sortByName);
  const languageList = categoriesMap
    ?.get(
      categoryTypes?.find((type) => type.name === CATEGORY_TYPES.LANGUAGE)?.id,
    )
    ?.toArray();

  // initialize state variable
  const [selectedValues, setSelectedValues] = useState([]);

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

  const handleChange = (valueList) => (event, value, reason) => {
    if (reason === SELECT_OPTION) {
      // post new category
      const newCategoryId = value.at(-1).id;
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
      const deletedEntry = itemCategories.find(
        (entry) => entry.categoryId === result[0].id,
      );
      deleteItemCategory({
        itemId,
        itemCategoryId: deletedEntry.id,
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Typography variant="h6" className={classes.selection}>
        {t('Category')}
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
    </div>
  );
};

CategorySelection.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default CategorySelection;
