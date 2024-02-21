import { DependencyList, useEffect, useRef } from "react";

export default function useOnUnmount(
  callback: () => void,
  dependencies: DependencyList
) {
  const isUnmountingRef = useRef(false);

  useEffect(
    () => () => {
      isUnmountingRef.current = true;
    },
    []
  );

  useEffect(
    () => () => {
      if (isUnmountingRef.current) {
        callback();
      }
    },
    dependencies
  );
}
