import React, { useEffect } from "react";

export default function useClickOutsideEffect(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  dependencies: React.DependencyList
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, ...dependencies]);
}
