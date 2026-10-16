import type { InquiryStatus, InquiryType } from './types';

type QueryState = {
  page?: number;
  status?: InquiryStatus;
  type?: InquiryType;
  keyword?: string;
  selected?: string | null;
};

export function buildInquiryHref(
  basePath: string,
  { page, status, type, keyword, selected }: QueryState
) {
  const params = new URLSearchParams();
  if (page && page > 1) params.set('page', String(page));
  if (status) params.set('status', status);
  if (type) params.set('type', type);
  if (keyword) params.set('keyword', keyword);
  if (selected) params.set('selected', selected);

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
