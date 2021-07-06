import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ITEMS_GRID_NO_SEARCH_RESULT_ID,
  ITEM_SEARCH_INPUT_ID,
} from '../../config/selectors';

const useSearchStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ItemSearchInput = (props) => {
  const { searchInputHandler, searchTextState } = props;
  const classes = useSearchStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <OutlinedInput
        id={ITEM_SEARCH_INPUT_ID}
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        onChange={searchInputHandler}
        value={searchTextState}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

ItemSearchInput.propTypes = {
  searchInputHandler: PropTypes.func,
  searchTextState: PropTypes.string,
};

ItemSearchInput.defaultProps = {
  searchInputHandler: () => {},
  searchTextState: '',
};

const NoItemSearchResult = () => {
  const { t } = useTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_SEARCH_RESULT_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {t('No search results found.')}
    </Typography>
  );
};

const useItemSearch = (items) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchInput = (event) => {
    const text = event.target.value;
    setSearchText(text.toLowerCase());
  };

  const results = items.filter((it) =>
    it.name.toLowerCase().includes(searchText),
  );

  const itemSearchInput = (
    <ItemSearchInput
      searchInputHandler={handleSearchInput}
      searchTextState={searchText}
    />
  );
  return { results, text: searchText, input: itemSearchInput };
};

export { useItemSearch, ItemSearchInput, NoItemSearchResult };
