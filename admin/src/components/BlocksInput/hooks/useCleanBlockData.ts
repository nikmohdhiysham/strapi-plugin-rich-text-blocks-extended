import { useCallback } from 'react';
import { Descendant } from 'slate';
import { cleanBlockData } from '../utils/cleanBlockData';

/**
 * Hook that provides a function to clean block data
 * This can be used before saving or exporting data
 */
export const useCleanBlockData = () => {
  const clean = useCallback((data: Descendant[]) => {
    return cleanBlockData(data);
  }, []);

  return { cleanBlockData: clean };
};