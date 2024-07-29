import { ReactElement } from 'react';

import { PRIMARY_COLOR } from '@graasp/ui';

import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from '@air/react-drag-to-select';

import { ITEM_CARD_CLASS } from '@/config/selectors';

import { useSelectionContext } from './SelectionContext';

export const useDragSelection = ({
  elementClass = ITEM_CARD_CLASS,
  adjustments = {},
} = {}): (() => ReactElement) => {
  const { addToSelection, clearSelection } = useSelectionContext();

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
              addToSelection(itemId);
            }
          }
        },
      );
    },
    shouldStartSelecting: (e) => {
      // does not trigger drag selection if mousedown on card
      if (e instanceof HTMLElement) {
        return !e?.closest(`.${elementClass}`);
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
        // adjustement
        // https://github.com/AirLabsTeam/react-drag-to-select/issues/30
        ...adjustments,
        border: `2px dashed ${PRIMARY_COLOR}`,
        borderRadius: 4,
        backgroundColor: 'lightblue',
        opacity: 0.5,
        zIndex: 999,
      },
    },
    isEnabled: true,
  });

  return DragSelection;
};
