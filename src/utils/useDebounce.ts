import { useEffect, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';

/**
 * This custom hooks create a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * **Warning**: It is important to use useCallback for the callback params to ensure to not end in an infinite loop.
 *
 * @param callback The callback function to debounce, returned by a **useCallback**.
 * @param debounceDelayMS The number of milliseconds to delay.
 * @returns isDebounced Indicates if the callback is debounced or not.
 */
export const useDebouncedCallback = (
  callback: () => void,
  debounceDelayMS: number,
): { isDebounced: boolean } => {
  const [isDebounced, setIsDebounced] = useState<boolean>(false);

  const debounceSetSend = useMemo(() => {
    setIsDebounced(true);
    return debounce(() => {
      callback();
      setIsDebounced(false);
    }, debounceDelayMS);
  }, [callback, debounceDelayMS]);

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => () => debounceSetSend.cancel(), [debounceSetSend]);

  // Call debounce to minimize calls
  useEffect(() => debounceSetSend(), [debounceSetSend, callback]);

  return {
    isDebounced,
  };
};

export default useDebouncedCallback;
