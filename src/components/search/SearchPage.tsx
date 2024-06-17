import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';

import {
  ItemType,
  ItemTypeUnion,
  PermissionLevel,
  formatDate,
} from '@graasp/sdk';

import { ArrowDownAZ, ArrowDownZA, Search } from 'lucide-react';

import { Ordering } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';

const pageSize = 10;

type SearchItemSortableColumn =
  | 'rank'
  | 'item.name'
  | 'item.creator.name'
  | 'item.type'
  | 'item.created_at'
  | 'item.updated_at';

const SearchPage = (): JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const { t: translateBuilder, i18n } = useBuilderTranslation();
  const [enabled, setEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<SearchItemSortableColumn>('rank');
  const [ordering, setOrdering] = useState<'asc' | 'desc'>('asc');
  const [types, setTypes] = useState<ItemTypeUnion[]>([]);
  const [permissions, setPermissions] = useState<PermissionLevel[]>([]);
  const parentId = searchParams.get('parentId') ?? undefined;
  const { data: parentItem, isError } = hooks.useItem(parentId);
  const [shouldSearchWithinItem, setShouldSearchWithinItem] = useState<boolean>(
    Boolean(parentId),
  );

  const [keywords, setKeywords] = useState<string[]>();

  let finalOrdering = ordering;
  if (sortBy === 'rank' && !keywords) {
    finalOrdering = 'desc';
  }

  let finalSortBy = sortBy;
  if (sortBy === 'rank' && !keywords) {
    finalSortBy = 'item.updated_at';
  }

  const { data, isFetching, isFetchingNextPage, fetchNextPage } =
    hooks.useSearchItems(
      {
        parentId: shouldSearchWithinItem ? parentId : undefined,
        permissions,
        keywords,
        types,
        ordering: finalOrdering,
        sortBy: finalSortBy,
      },
      {},
      { enabled },
    );

  const inputRef = useRef();

  const currentTotalCount = (data?.pages?.length ?? 0) * (pageSize ?? 10);
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  const search = async () => {
    setEnabled(true);
    if (inputRef.current?.value) {
      setKeywords(inputRef.current.value.split(' '));
    }
  };

  const toggleType = (type: ItemTypeUnion) => {
    setEnabled(true);
    if (types.includes(type)) {
      setTypes(types.filter((a) => a !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const togglePermission = (p: PermissionLevel) => {
    setEnabled(true);
    if (permissions.includes(p)) {
      setPermissions(permissions.filter((a) => a !== p));
    } else {
      setPermissions([...permissions, p]);
    }
  };

  const sortByOrderingOptions: {
    sortBy: SearchItemSortableColumn;
    ordering: Ordering;
    text: string;
  }[] = [
    { sortBy: 'rank', ordering: Ordering.DESC, text: 'pertinence' },
    { sortBy: 'item.name', ordering: Ordering.ASC, text: 'name (asc)' },
    {
      sortBy: 'item.name',
      ordering: Ordering.DESC,
      text: 'name (desc)',
    },
    {
      sortBy: 'item.creator.name',
      ordering: Ordering.ASC,
      text: 'creator (asc)',
    },
    {
      sortBy: 'item.creator.name',
      ordering: Ordering.DESC,
      text: 'creator (desc)',
    },
    {
      sortBy: 'item.updated_at',
      ordering: Ordering.ASC,
      text: 'dernière modification (asc)',
    },
    {
      sortBy: 'item.updated_at',
      ordering: Ordering.DESC,
      text: 'dernière modification (desc)',
    },
  ];

  if (isError) {
    return <Alert severity="error">no corresponding item</Alert>;
  }

  return (
    <>
      <Helmet>
        <title>{translateBuilder('Search')}</title>
      </Helmet>
      <Container>
        <Typography variant="h1" textAlign="center" noWrap>
          Search in {shouldSearchWithinItem ? parentItem?.name : 'Graasp'}
        </Typography>
        <TextField
          sx={{ mt: 2 }}
          variant="outlined"
          placeholder="search..."
          fullWidth
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {parentId && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() =>
                    setShouldSearchWithinItem(!shouldSearchWithinItem)
                  }
                  checked={shouldSearchWithinItem}
                />
              }
              label={`Search within ${parentItem.name}`}
            />
          </FormGroup>
        )}

        {Object.values(ItemType).map((t) => (
          <Chip
            color={types.includes(t) ? 'success' : undefined}
            onClick={() => toggleType(t)}
            label={t}
            key={t}
            sx={{ mx: 1 }}
          />
        ))}
        <br />

        {Object.values(PermissionLevel).map((p) => (
          <Chip
            color={permissions.includes(p) ? 'success' : undefined}
            onClick={() => togglePermission(p)}
            label={p}
            key={p}
            sx={{ mx: 1 }}
          />
        ))}
        <br />
        <Select
          defaultValue={0}
          onChange={(i) => {
            const idx = i.target.value as number;
            if (idx >= 0) {
              setSortBy(sortByOrderingOptions[idx].sortBy);
              setOrdering(sortByOrderingOptions[idx].ordering);
            }
          }}
        >
          {sortByOrderingOptions.map((d, idx) => (
            <MenuItem value={idx} key={d.text}>
              {d.text}
            </MenuItem>
          ))}
        </Select>

        <IconButton
          onClick={() =>
            ordering === 'asc' ? setOrdering('desc') : setOrdering('asc')
          }
        >
          {ordering === 'asc' ? <ArrowDownZA /> : <ArrowDownAZ />}
        </IconButton>
        {/* TODO: disabled if params did not change */}
        <LoadingButton
          variant="contained"
          loading={isFetching}
          onClick={() => search()}
          fullWidth
        >
          Search
        </LoadingButton>
        {totalCount ? (
          <Typography variant="caption">
            found {totalCount} results for {keywords}
          </Typography>
        ) : null}
        {data?.pages?.map((p) =>
          p.data
            // eslint-disable-next-line arrow-body-style
            ?.map((i) => {
              return (
                <Typography key={i.id}>
                  {i.id} {i.name} -
                  {formatDate(i.createdAt, { locale: i18n.language })}
                </Typography>
              );
            }),
        )}
        {Boolean(enabled && !isFetching && totalCount === 0) && (
          <Typography variant="h4" textAlign="center">
            No result found for {keywords}
          </Typography>
        )}
        {totalCount > currentTotalCount && (
          <LoadingButton
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="contained"
          >
            show next page
          </LoadingButton>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
