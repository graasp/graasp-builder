import { Typography } from '@mui/material';

import { useFilterItemsContext } from '@/components/context/FilterItemsContext';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

const HomeScreenNoItemFilters = ({
  searchText,
}: {
  searchText: string;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { itemTypes } = useFilterItemsContext();

  return (
    <>
      <Typography variant="body1" textAlign="center">
        {translateBuilder(BUILDER.ITEM_SEARCH_NOTHING_FOUND)}
      </Typography>
      {searchText && (
        <Typography variant="body1" textAlign="center">
          <strong>
            {translateBuilder(BUILDER.ITEM_SEARCH_NOTHING_FOUND_QUERY_TITLE)}
          </strong>
          : {searchText}
        </Typography>
      )}
      {itemTypes.length ? (
        <Typography variant="body1" textAlign="center">
          <strong>
            {translateBuilder(BUILDER.ITEM_SEARCH_NOTHING_FOUND_TYPES_TITLE)}:{' '}
            {itemTypes.join(', ')}
          </strong>
        </Typography>
      ) : null}
    </>
  );
};

export default HomeScreenNoItemFilters;
