import { ChangeEvent, useState } from 'react';

import { Typography } from '@mui/material';

import { SearchInput } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEMS_GRID_NO_SEARCH_RESULT_ID,
  ITEM_SEARCH_INPUT_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

export const NoItemSearchResult = (): JSX.Element => {
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

export const useItemSearch = ({
  onSearch,
}: {
  onSearch?: () => void;
} = {}): {
  text: string;
  input: JSX.Element;
} => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [searchText, setSearchText] = useState<string>('');

  const handleSearchInput = (event: ChangeEvent<{ value: string }>) => {
    const text = event.target.value;
    setSearchText(text);
    onSearch?.();
  };

  const itemSearchInput = (
    <SearchInput
      key="searchInput"
      onChange={handleSearchInput}
      value={searchText}
      inputBaseId={ITEM_SEARCH_INPUT_ID}
      placeholder={translateBuilder(BUILDER.ITEM_SEARCH_PLACEHOLDER)}
      size="small"
      dataUmamiEvent="item-search"
    />
  );
  return { text: searchText, input: itemSearchInput };
};
