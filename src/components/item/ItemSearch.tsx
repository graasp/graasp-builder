import { List, RecordOf } from 'immutable';

import Typography from '@mui/material/Typography';

import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Item } from '@graasp/sdk';
import { SearchInput } from '@graasp/ui';

import {
  ITEMS_GRID_NO_SEARCH_RESULT_ID,
  ITEM_SEARCH_INPUT_ID,
} from '../../config/selectors';

export const NoItemSearchResult = () => {
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

export const useItemSearch = (items: List<RecordOf<Item>>) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearchInput = (event: ChangeEvent<{ value: string }>) => {
    const text = event.target.value;
    setSearchText(text.toLowerCase());
  };

  const results = items?.filter((it) =>
    it?.name?.toLowerCase().includes(searchText),
  );

  const itemSearchInput = (
    <SearchInput
      key="searchInput"
      onChange={handleSearchInput}
      value={searchText}
      inputBaseId={ITEM_SEARCH_INPUT_ID}
    />
  );
  return { results, text: searchText, input: itemSearchInput };
};
