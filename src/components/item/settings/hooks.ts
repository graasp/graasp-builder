// eslint-disable-next-line import/no-extraneous-dependencies
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';

import { ItemGeolocation } from '@graasp/sdk';

import { OpenStreetMapProvider } from 'leaflet-geosearch';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';

import useDebouncedCallback from '@/utils/useDebounce';

type Props = {
  geoloc?: ItemGeolocation | null;
  lang: string;
};

const DELAY_MS = 1000;

type ReturnedValue = {
  clearQuery: () => void;
  isDebounced: boolean;
  loading: boolean;
  query?: string | null;
  results: SearchResult<RawResult>[];
  setQuery: Dispatch<string | null>;
  setResults: Dispatch<SearchResult<RawResult>[]>;
};

// eslint-disable-next-line import/prefer-default-export
export const useSearchAddress = ({ lang, geoloc }: Props): ReturnedValue => {
  const [results, setResults] = useState<SearchResult<RawResult>[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | null | undefined>();

  const provider = useMemo(
    () =>
      new OpenStreetMapProvider({
        params: {
          'accept-language': lang,
        },
      }),
    [lang],
  );

  useEffect(() => {
    setQuery(geoloc?.addressLabel);
  }, [geoloc]);

  const callback = useCallback(() => {
    if (query && query !== geoloc?.addressLabel) {
      setLoading(true);
      provider
        .search({ query })
        .then((e) => {
          setResults(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, geoloc?.addressLabel, provider]);

  const clearQuery = () => {
    setQuery('');
  };

  const { isDebounced } = useDebouncedCallback(callback, DELAY_MS);

  return {
    results,
    query,
    setQuery,
    isDebounced,
    setResults,
    loading,
    clearQuery,
  };
};
