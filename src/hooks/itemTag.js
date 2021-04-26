import { useQuery } from 'react-query';
import { buildItemTagsQuery, buildTagsQuery } from './utils';

export const useTags = () => useQuery(buildTagsQuery());

export const useItemTags = (id) =>
  useQuery({
    ...buildItemTagsQuery(id),
    enabled: Boolean(id),
  });
