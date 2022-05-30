import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  buildCategorySelectionId,
  buildCategorySelectionTitleId,
} from '../../../config/selectors';

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

const DropdownMenu = ({ title, handleChange, valueList, selectedValues }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  if (!valueList) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body1" id={buildCategorySelectionTitleId(title)}>
        {title}
      </Typography>
      <Autocomplete
        className={classes.dropMenu}
        disabled={!valueList}
        multiple
        disableClearable
        id={buildCategorySelectionId(title)}
        value={valueList?.filter((value) => selectedValues.includes(value))}
        getOptionSelected={(option, value) => option.id === value.id}
        options={valueList}
        getOptionLabel={(option) => option.name}
        onChange={handleChange}
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

DropdownMenu.propTypes = {
  title: PropTypes.string.isRequired,
  valueList: PropTypes.instanceOf(Array).isRequired,
  selectedValues: PropTypes.instanceOf(Array).isRequired,
  handleChange: PropTypes.instanceOf(Function).isRequired,
};

export default DropdownMenu;
