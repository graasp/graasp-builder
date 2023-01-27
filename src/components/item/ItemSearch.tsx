import { List } from 'immutable';

import Typography from '@mui/material/Typography';

import { ChangeEvent, FC, useState } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { SearchInput } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEMS_GRID_NO_SEARCH_RESULT_ID,
  ITEM_SEARCH_INPUT_ID,
} from '../../config/selectors';

export const NoItemSearchResult: FC = () => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_SEARCH_RESULT_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {translateBuilder(BUILDER.ITEM_SEARCH_NO_RESULTS_MESSAGE)}
    </Typography>
  );
};

export const useItemSearch = (
  items: List<ItemRecord>,
): {
  results: List<ItemRecord>;
  text: string;
  input: JSX.Element;
} => {
  const { t: translateBuilder } = useBuilderTranslation();
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
      placeholder={translateBuilder(BUILDER.ITEM_SEARCH_PLACEHOLDER)}
    />
  );
  return { results, text: searchText, input: itemSearchInput };
};
