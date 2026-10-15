import type { InquiryStatus } from './types';

type QueryState = {
  page?: number;
  status?: InquiryStatus;
  keyword?: string;
  selected?: string | null;
};

export function buildInquiryHref(
  basePath: string,
  { page, status, keyword, selected }: QueryState
) {
  const params = new URLSearchParams();
  if (page && page > 1) params.set('page', String(page));
  if (status) params.set('status', status);
  if (keyword) params.set('keyword', keyword);
  if (selected) params.set('selected', selected);

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
