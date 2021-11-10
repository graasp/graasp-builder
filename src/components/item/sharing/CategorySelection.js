/* eslint-disable react/jsx-props-no-spreading */
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

const useStyles = makeStyles({
  Selection: {
    marginTop: 20,
  },
  DropMenu: {
    marginBottom: 10,
  },
});

function CategorySelection({ item, edit }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: createItemCategory } = useMutation(POST_ITEM_CATEGORY);
  const { mutate: deleteItemCategory } = useMutation(DELETE_ITEM_CATEGORY);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  // extra value
  const {
    data: itemCategories,
    isLoading: isItemCategoriesLoading,
  } = useItemCategories(itemId);
  const {
    data: categoryTypes,
    isLoading: isCategoryTypesLoading,
  } = useCategoryTypes();
  const { data: allCategories, isLoading: isCategoriesLoading } = useCategories(
    [],
  );
  const ageList = allCategories?.filter(
    (entry) => entry.type === categoryTypes?.get(0).id,
  );
  const disciplineList = allCategories?.filter(
    (entry) => entry.type === categoryTypes?.get(1).id,
  );

  const mapItemCategory = new Map(
    itemCategories?.map((obj) => [obj.category_id, obj.id]),
  );
  const ageCategory = ageList?.map((entry) => entry.id);
  const disciplineCategory = disciplineList?.map((entry) => entry.id);

  // seperate age and discipline category
  const initialAgeValue = itemCategories?.filter((itemCategory) =>
    ageCategory?.includes(itemCategory.category_id),
  );
  const initialDisciplineValue = itemCategories?.filter((itemCategory) =>
    disciplineCategory?.includes(itemCategory.category_id),
  );
  const selectedDisciplineIds = initialDisciplineValue
    ?.map((entry) => entry.category_id)
    .toArray();
  const selectedAgeIds = initialAgeValue
    ?.map((entry) => entry.category_id)
    .toArray();
  // set initial value
  const [ageOptionsValue, setAgeOptionsValue] = useState([]);
  const [disciplineOptionsValue, setDisciplineOptionsValue] = useState([]);

  // update state variables depending on fetch values
  useEffect(() => {
    if (selectedAgeIds && ageList) {
      setAgeOptionsValue(
        ageList.filter((entry) => selectedAgeIds.includes(entry.id)).toArray(),
      );
    }
  }, [item, itemCategories, ageList, selectedAgeIds]);

  useEffect(() => {
    if (selectedDisciplineIds && disciplineList) {
      setDisciplineOptionsValue(
        disciplineList
          .filter((entry) => selectedDisciplineIds.includes(entry.id))
          .toArray(),
      );
    }
  }, [item, itemCategories, disciplineList, selectedDisciplineIds]);

  if (
    isMemberLoading ||
    isItemCategoriesLoading ||
    isCategoryTypesLoading ||
    isCategoriesLoading
  ) {
    return <Loader />;
  }

  const handleAgeChange = (event, value, reason) => {
    if (reason === 'select-option') {
      // post new category (discipline)
      const newCategoryId = value.at(-1).id;
      createItemCategory({
        itemId,
        categoryId: newCategoryId,
      });
    } else if (reason === 'remove-option') {
      // remove an option
      const result = ageOptionsValue.filter(
        ({ id: id1 }) => !value.some(({ id: id2 }) => id2 === id1),
      );
      const entryId = mapItemCategory.get(result[0].id);
      deleteItemCategory({
        itemId,
        entryId,
      });
    }
  };

  const handleDisciplineChange = (event, value, reason) => {
    if (reason === 'select-option') {
      // post new category (discipline)
      const newCategoryId = value.at(-1).id;
      createItemCategory({
        itemId,
        categoryId: newCategoryId,
      });
    } else if (reason === 'remove-option') {
      // remove an option
      const result = disciplineOptionsValue.filter(
        ({ id: id1 }) => !value.some(({ id: id2 }) => id2 === id1),
      );
      const entryId = mapItemCategory.get(result[0].id);
      deleteItemCategory({
        itemId,
        entryId,
      });
    }
  };
  const disciplines = disciplineList.toArray();
  const ageGroups = ageList.toArray();
  return (
    <>
      <Typography variant="h6" className={classes.Selection}>
        {t('Category')}
      </Typography>
      <Typography variant="body1"> Age Range: </Typography>
      {edit && (
        <Autocomplete
          multiple
          disableClearable
          id={SHARE_ITEM_CATEGORY_AGE}
          value={ageOptionsValue}
          getOptionSelected={(option, value) => option.id === value.id}
          options={ageGroups}
          getOptionLabel={(option) => option.name}
          onChange={handleAgeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Please Choose From List"
            />
          )}
        />
      )}
      <Typography variant="body1"> Discipline: </Typography>
      {edit && (
        <Autocomplete
          multiple
          disableClearable
          id={SHARE_ITEM_CATEGORY_DISCIPLINE}
          value={disciplineOptionsValue}
          getOptionSelected={(option, value) => option.id === value.id}
          options={disciplines}
          getOptionLabel={(option) => option.name}
          onChange={handleDisciplineChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Please Choose From List"
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
