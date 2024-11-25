import { useRouter } from 'next/router';

/**
 * Hook to extract the query params for a page request
 */
const useQueryParams = (): Record<string, string | string[]> => {
  const router = useRouter();
  return router?.query || {};
};

export default useQueryParams;
