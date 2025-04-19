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

  limit: parseAsIndex.withDefault(2),

  // For Fee Assignment Page
  pageSize: parseAsIndex.withDefault(10), //  Default to 10 items per page
  pageIndex: parseAsIndex.withDefault(1),
  search: parseAsString.withDefault(''),
  sectionId: parseAsString.withDefault('all'),
  gradeId: parseAsString.withDefault('all'),

  startDate: parseAsString.withDefault(''),
  endDate: parseAsString.withDefault(''),
  status: parseAsString.withDefault('all'),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
