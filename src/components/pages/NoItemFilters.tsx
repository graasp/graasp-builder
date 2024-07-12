import { Box, Typography } from '@mui/material';

import { useFilterItemsContext } from '@/components/context/FilterItemsContext';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

const NoItemFilters = ({ searchText }: { searchText: string }): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { itemTypes } = useFilterItemsContext();

  return (
    <Box mt={1}>
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
          </strong>
          {itemTypes.join(', ')}
        </Typography>
      ) : null}
    </Box>
  );
};

export default NoItemFilters;
