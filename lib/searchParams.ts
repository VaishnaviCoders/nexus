// searchParams.ts

import {
  parseAsString,
  createSearchParamsCache,
  parseAsArrayOf,
} from 'nuqs/server';

export const searchParams = {
  gradeFilter: parseAsArrayOf(parseAsString).withDefault([]),
  sectionFilter: parseAsArrayOf(parseAsString).withDefault([]),
  q: parseAsString.withDefault(''),
};
export const searchParamsCache = createSearchParamsCache(searchParams);
