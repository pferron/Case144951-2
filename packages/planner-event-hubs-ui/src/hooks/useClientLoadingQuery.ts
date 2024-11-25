import { useEffect, useMemo, useState } from 'react';
import { DocumentNode, OperationVariables, QueryHookOptions, useQuery } from '@apollo/client';

// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useClientLoadingQuery = (query: DocumentNode, options: QueryHookOptions<any, OperationVariables>): any => {
  const [loading, setLoading] = useState(false);
  const { data, refetch } = useQuery(query, {
    ...options,
    ssr: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && refetch) {
      setLoading(true);
      refetch().then(() => setLoading(false));
    }
  }, [refetch]);
  return useMemo(
    () => ({
      data,
      loading,
      refetch
    }),
    [data, loading, refetch]
  );
};
