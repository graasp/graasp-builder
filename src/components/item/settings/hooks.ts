import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';

import { useDebounceCallback } from '@graasp/query-client';
import { ItemGeolocation } from '@graasp/sdk';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

type Props = {
  geoloc?: ItemGeolocation | null;
  lang: string;
};

const DELAY_MS = 1000;

export type OpenStreetMapResult = Awaited<
  ReturnType<OpenStreetMapProvider['search']>
>[0];

type ReturnedValue = {
  clearQuery: () => void;
  isDebounced: boolean;
  loading: boolean;
  query?: string | null;
  results: OpenStreetMapResult[];
  setQuery: Dispatch<string | null>;
  setResults: Dispatch<OpenStreetMapResult[]>;
};

// eslint-disable-next-line import/prefer-default-export
export const useSearchAddress = ({ lang, geoloc }: Props): ReturnedValue => {
  const [results, setResults] = useState<OpenStreetMapResult[]>([]);
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

  const { isDebounced } = useDebounceCallback(callback, DELAY_MS);

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
