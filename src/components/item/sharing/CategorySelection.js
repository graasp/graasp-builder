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
  SHARE_ITEM_CATEGORY_LEVEL,
  SHARE_ITEM_CATEGORY_DISCIPLINE,
  SHARE_ITEM_CATEGORY_LEVEL_TITLE_ID,
} from '../../../config/selectors';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import ErrorAlert from '../../common/ErrorAlert';
import { CATEGORY_TYPES } from '../../../config/constants';
import { sortByName } from '../../../utils/item';

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

const CategorySelection = ({ item, edit }) => {
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

  if (!levelList || !disciplineList) {
    return <ErrorAlert />;
  }

  const handleChange = (categoryType) => (event, value, reason) => {
    const typeMap = { level: levelList, discipline: disciplineList };
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
        itemCategoryId: deletedEntry.id,
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Typography variant="h6" className={classes.selection}>
        {t('Category')}
      </Typography>
      <Typography variant="body1" id={SHARE_ITEM_CATEGORY_LEVEL_TITLE_ID}>
        {t('Level')}
      </Typography>
      <Autocomplete
        className={classes.dropMenu}
        disabled={!edit || !levelList}
        multiple
        disableClearable
        id={SHARE_ITEM_CATEGORY_LEVEL}
        value={levelList?.filter((value) => selectedValues.includes(value))}
        getOptionSelected={(option, value) => option.id === value.id}
        options={levelList}
        getOptionLabel={(option) => option.name}
        onChange={handleChange('level')}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="outlined"
            placeholder={t('Please choose from list')}
          />
        )}
      />
      <Typography variant="body1">{t('Discipline')}</Typography>
      <Autocomplete
        className={classes.dropMenu}
        disabled={!edit || !levelList}
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="outlined"
            placeholder={t('Please choose from list')}
          />
        )}
      />
    </div>
  );
};

CategorySelection.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CategorySelection;
