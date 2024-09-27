import { ReactNode, useState } from 'react';

import { Stack } from '@mui/material';

import { PRIMARY_COLOR } from '@graasp/ui';

import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from '@air/react-drag-to-select';

import { ITEM_CARD_CLASS } from '@/config/selectors';

import { useSelectionContext } from './SelectionContext';

export const DragContainerStack = ({
  gap,
  id,
  children,
}: {
  gap?: number;
  id: string;
  children: ReactNode;
}): JSX.Element => (
  <Stack
    // this is a hack to allow selection dragging from margin
    // 100 is artbitrary big
    mx={-100}
    px={100}
    height="100%"
    id={id}
    gap={gap}
  >
    {children}
  </Stack>
);

export const useDragSelection = ({
  elementClass = ITEM_CARD_CLASS,
  containerId,
}: {
  containerId: string;
  elementClass?: string;
}): JSX.Element => {
  const { addToSelection, clearSelection } = useSelectionContext();
  const [boundingBox, setBoundingBox] = useState<null | {
    top: number;
    left: number;
  }>(null);

  const { DragSelection: HookComponent } = useSelectionContainer({
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

      setBoundingBox(scrollAwareBox);

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
      if (e instanceof HTMLElement || e instanceof SVGElement) {
        // does not trigger if click is outside of container
        if (!e.closest(`#${containerId}`)) {
          return false;
        }

        // does not trigger drag selection if mousedown on card
        return !e?.closest(`.${elementClass}`);
      }
      return true;
    },
    onSelectionStart: () => {
      // clear selection on new dragging action
      clearSelection();
      setBoundingBox(null);
    },
    onSelectionEnd: () => {
      setBoundingBox(null);
    },
    selectionProps: {
      style: {
        display: 'none',
      },
    },
    isEnabled: true,
  });

  // we don't use native overlay because it's bound to the wrapper
  // https://github.com/AirLabsTeam/react-drag-to-select/issues/30
  const DragSelection = (
    <>
      <div
        style={{
          position: 'fixed',
          border: `2px dashed ${PRIMARY_COLOR}`,
          borderRadius: 4,
          backgroundColor: 'lightblue',
          opacity: 0.5,
          zIndex: 999,
          display: boundingBox?.top ? 'block' : 'none',
          ...boundingBox,
        }}
      />
      <HookComponent />
    </>
  );

  return DragSelection;
};
