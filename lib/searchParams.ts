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

  search: parseAsString.withDefault(''),
  sectionId: parseAsString.withDefault('all'),
  status: parseAsString.withDefault('all'),
  grade: parseAsString.withDefault('all'),
  startDate: parseAsString.withDefault(''),
  endDate: parseAsString.withDefault(''),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
