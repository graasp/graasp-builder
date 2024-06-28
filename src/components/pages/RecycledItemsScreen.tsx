import { Helmet } from 'react-helmet';

import { Container, Stack, Typography } from '@mui/material';

import { Loader } from '@graasp/ui';

import { Ordering } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import DeleteButton from '../common/DeleteButton';
import ErrorAlert from '../common/ErrorAlert';
import RestoreButton from '../common/RestoreButton';
import SelectTypes from '../common/SelectTypes';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import ItemCard from '../table/ItemCard';
import SortingSelect from '../table/SortingSelect';
import {
  SortingOptions,
  useSorting,
  useTranslatedSortingOptions,
} from '../table/useSorting';

const RecycleBinLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: recycledItems, isLoading, isError } = hooks.useRecycledItems();
  const options = useTranslatedSortingOptions();
  const { shouldDisplayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const itemSearch = useItemSearch();
  const filteredData = recycledItems?.filter(
    (d) => shouldDisplayItem(d.type) && d.name.includes(itemSearch.text),
  );
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  filteredData?.sort(sortFn);

  if (filteredData) {
    return (
      <>
        <Helmet>
          <title>{translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}</title>
        </Helmet>
        <Container id={RECYCLED_ITEMS_ROOT_CONTAINER} sx={{ my: 2 }}>
          <Stack
            mb={2}
            direction="row"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{ wordWrap: 'break-word' }}
            >
              {translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
            >
              {itemSearch.input}
            </Stack>
          </Stack>
          <Stack gap={1}>
            <Stack
              alignItems="space-between"
              direction="column"
              mt={2}
              gap={1}
              width="100%"
            >
              <Stack
                spacing={1}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <SelectTypes />
                <Stack direction="row" gap={1}>
                  {sortBy && setSortBy && (
                    <SortingSelect
                      sortBy={sortBy}
                      options={options}
                      setSortBy={setSortBy}
                      ordering={ordering}
                      setOrdering={setOrdering}
                    />
                  )}
                  <ModeButton />
                </Stack>
              </Stack>
            </Stack>
            {filteredData.length ? (
              filteredData.map((item) => (
                <ItemCard
                  item={item}
                  showThumbnail={false}
                  footer={
                    <>
                      <RestoreButton itemIds={[item.id]} />
                      <DeleteButton itemIds={[item.id]} />
                    </>
                  }
                />
              ))
            ) : (
              <Typography variant="body2">
                {translateBuilder(BUILDER.TRASH_NO_ITEM)}
              </Typography>
            )}
          </Stack>
        </Container>
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
  }

  return null;
};

const RecycledItemsScreen = (): JSX.Element => <RecycleBinLoadableContent />;

export default RecycledItemsScreen;
