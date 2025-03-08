import {
  parseAsString,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsIndex,
} from 'nuqs/server';

export const searchParams = {
  gradeFilter: parseAsArrayOf(parseAsString).withDefault([]),
  sectionFilter: parseAsArrayOf(parseAsString).withDefault([]),
  q: parseAsString.withDefault(''),
  pageIndex: parseAsIndex.withDefault(1),
  limit: parseAsIndex.withDefault(2),
};
export const searchParamsCache = createSearchParamsCache(searchParams);
