import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PRIMARY_COLOR } from '@graasp/ui';

import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from '@air/react-drag-to-select';

import { ITEM_CARD_CLASS } from '@/config/selectors';

type SelectionContextValue = {
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextValue>({
  selectedIds: [],
  toggleSelection: () => {},
  clearSelection: () => {},
});

export const SelectionContextProvider = ({
  children,
  elementClass = ITEM_CARD_CLASS,
}: {
  children: JSX.Element;
  elementClass?: string;
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

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById('root'),
    onSelectionChange: (box) => {
      /**
       * Here we make sure to adjust the box's left and top with the scroll position of the window
       * @see https://github.com/AirLabsTeam/react-drag-to-select/#scrolling
       */
      const scrollAwareBox: Box = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      Array.from(document.getElementsByClassName(elementClass)).forEach(
        (item) => {
          const bb = item.getBoundingClientRect();
          if (
            boxesIntersect(scrollAwareBox, bb) &&
            item.parentNode instanceof HTMLElement
          ) {
            const itemId = item.parentNode.dataset.id;
            if (itemId) {
              selection.add(itemId);
            }
          }
        },
      );

      setSelection(new Set(selection));
    },
    shouldStartSelecting: (e) => {
      // does not trigger drag selection if mousedown on card
      if (e instanceof HTMLElement) {
        return !e?.closest(`.${ITEM_CARD_CLASS}`);
      }
      return true;
    },
    onSelectionStart: () => {
      // clear selection on new dragging action
      clearSelection();
    },
    onSelectionEnd: () => {},
    selectionProps: {
      style: {
        border: `2px dashed ${PRIMARY_COLOR}`,
        borderRadius: 4,
        backgroundColor: 'lightblue',
        opacity: 0.5,
      },
    },
    isEnabled: true,
  });

  const value: SelectionContextValue = useMemo(
    () => ({
      selectedIds: [...selection.values()],
      toggleSelection,
      clearSelection,
      elementsContainerRef,
    }),
    [selection, toggleSelection, clearSelection, elementsContainerRef],
  );

  return (
    <SelectionContext.Provider value={value}>
      <DragSelection />
      <div ref={elementsContainerRef}>{children}</div>
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = (): SelectionContextValue =>
  useContext<SelectionContextValue>(SelectionContext);
