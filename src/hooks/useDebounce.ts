import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";

import useOnUnmount from "hooks/useOnUnmount";

export default function useDebounce(
  action: (...args: any[]) => void,
  dependencies: React.DependencyList
) {
  const [pendingAction, setPendingAction] = useState(false);
  const [args, setArgs] = useState<any[]>([]);

  const debounced = useMemo(
    () =>
      debounce((...args) => {
        action(...args);
        setPendingAction(false);
      }, 500),
    dependencies
  );

  const result = useCallback(
    (...args: any[]) => {
      setPendingAction(true);
      setArgs(args);

      debounced(...args);
    },
    [debounced]
  );

  useOnUnmount(() => {
    if (pendingAction) {
      action(...args);
    }
  }, [pendingAction, args, ...dependencies]);

  return result;
}
