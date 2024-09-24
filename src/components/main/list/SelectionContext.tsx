import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Stack } from '@mui/material';

type SelectionContextValue = {
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextValue>({
  selectedIds: [],
  toggleSelection: () => {},
  addToSelection: () => {},
  clearSelection: () => {},
});

export const SelectionContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [selection, setSelection] = useState(new Set<string>());
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);

  const clearSelection = useCallback(() => {
    setSelection(new Set());
  }, []);

  const toggleSelection = useCallback(
    (id: string) => {
      if (selection.has(id)) {
        selection.delete(id);
      } else {
        selection.add(id);
      }
      setSelection(new Set(selection));
    },
    [selection],
  );

  const addToSelection = useCallback(
    (id: string) => {
      if (!selection.has(id)) {
        selection.add(id);
        setSelection(new Set(selection));
      }
    },
    [selection],
  );

  const value: SelectionContextValue = useMemo(
    () => ({
      selectedIds: [...selection.values()],
      toggleSelection,
      clearSelection,
      elementsContainerRef,
      addToSelection,
    }),
    [
      selection,
      toggleSelection,
      clearSelection,
      addToSelection,
      elementsContainerRef,
    ],
  );

  return (
    <SelectionContext.Provider value={value}>
      <Stack height="100%" ref={elementsContainerRef}>
        {children}
      </Stack>
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = (): SelectionContextValue =>
  useContext<SelectionContextValue>(SelectionContext);
