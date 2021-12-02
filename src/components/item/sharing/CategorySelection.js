import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import { Map } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../../config/queryClient';
import {
  SHARE_ITEM_CATEGORY_AGE,
  SHARE_ITEM_CATEGORY_DISCIPLINE,
} from '../../../config/selectors';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const { useCategoryTypes, useCategories, useItemCategories } = hooks;
const { POST_ITEM_CATEGORY, DELETE_ITEM_CATEGORY } = MUTATION_KEYS;

const SELECT_OPTION = 'select-option';
const REMOVE_OPTION = 'remove-option';

const useStyles = makeStyles((theme) => ({
  selection: {
    marginTop: theme.spacing(2),
  },
  dropMenu: {
    marginBottom: theme.spacing(1),
  },
}));

function CategorySelection({ item, edit }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: createItemCategory } = useMutation(POST_ITEM_CATEGORY);
  const { mutate: deleteItemCategory } = useMutation(DELETE_ITEM_CATEGORY);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  // get itemCategories, categoryTypes and allCategories
  const {
    data: itemCategories,
    isLoading: isItemCategoriesLoading,
  } = useItemCategories(itemId);
  const {
    data: categoryTypes,
    isLoading: isCategoryTypesLoading,
  } = useCategoryTypes();
  const {
    data: allCategories,
    isLoading: isCategoriesLoading,
  } = useCategories();

  // process data
  const categoriesMap = allCategories?.groupBy((entry) => entry.type);
  const ageList = categoriesMap
    ?.get(categoryTypes?.filter((type) => type.name === 'age').get(0).id)
    .toArray();
  const disciplineList = categoriesMap
    ?.get(categoryTypes?.filter((type) => type.name === 'discipline').get(0).id)
    .toArray();

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

  const handleChange = (categoryType) => (event, value, reason) => {
    const typeMap = { age: ageList, discipline: disciplineList };
    if (reason === SELECT_OPTION) {
      // post new category
      const newCategoryId = value.at(-1).id;
      createItemCategory({
        itemId,
        categoryId: newCategoryId,
      });
    } else if (reason === REMOVE_OPTION) {
      // remove an option
      const previousValues = typeMap[categoryType]?.filter((entry) =>
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
        entryId: deletedEntry.id,
      });
    }
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <>
      <Typography variant="h6" className={classes.Selection}>
        {t('Category')}
      </Typography>
      <Typography variant="body1">{t('Age Range')}</Typography>
      {edit && (
        <Autocomplete
          multiple
          disableClearable
          id={SHARE_ITEM_CATEGORY_AGE}
          value={ageList?.filter((value) => selectedValues.includes(value))}
          getOptionSelected={(option, value) => option.id === value.id}
          options={ageList}
          getOptionLabel={(option) => option.name}
          onChange={handleChange('age')}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={t('Please Choose From List')}
            />
          )}
        />
      )}
      <Typography variant="body1">{t('Discipline')}</Typography>
      {edit && (
        <Autocomplete
          multiple
          disableClearable
          id={SHARE_ITEM_CATEGORY_DISCIPLINE}
          value={disciplineList?.filter((value) =>
            selectedValues.includes(value),
          )}
          getOptionSelected={(option, value) => option.id === value.id}
          options={disciplineList}
          getOptionLabel={(option) => option.name}
          onChange={handleChange('discipline')}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={t('Please Choose From List')}
            />
          )}
        />
      )}
    </>
  );
}

CategorySelection.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CategorySelection;
