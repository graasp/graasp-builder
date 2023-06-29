import React, { useCallback, useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

import { useTourContext } from '../context/TourContext';
import { Step, steps as mainTourSteps } from './mainTour';

type TourProps = {
  children: React.ReactElement;
  run?: boolean;
  callbackOnComplete?: () => void;
};

export const Tour: React.FC<TourProps> = ({
  children,
  run,
  callbackOnComplete,
}) => {
  const [itemId, setItemId] = useState('');
  const [steps] = useState<Step[]>(mainTourSteps(itemId));
  const [activeTourStep, setActiveTourStep] = useState(0);
  // const [isTourReady, setIsTourReady] = useState(true);
  const [nextButtonSetting, setNextButtonSetting] = useState('');

  const { isTourOpen, tourSteps, manualRun, openTour, closeTour } =
    useTourContext();

  const waitForTargetElement = (
    targetSelector: string,
    callback: () => void,
  ) => {
    const interval = setInterval(() => {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        clearInterval(interval);
        callback();
      }
    }, 100); // TODO: add a timeout to this
  };

  const handleItemId = (fullId: string, prefix: string) => {
    console.log('handle iddddd: ', fullId?.substring(prefix.length));
    console.log('fullID: ', fullId);

    setItemId(fullId?.substring(prefix.length));
    //  setItemId('f575a2d0-6e30-4531-9fe4-e8ed4a605458');
  };

  /**  const getNumberOfItems = useCallback(
      (nextStepIndex: number) => {
        for (let i = 0; i < tourSteps.length; i += 1) {
          if (tourSteps[i].target === steps[nextStepIndex].parent) {
            console.log('PARENT:', steps[nextStepIndex].parent);
            return steps[nextStepIndex].numberOfItems;
          }
        }
        return 0; // TODO might exist a better way
      },
      [steps, tourSteps],
    ); */

  /**  const waitForIncreaseElement = (targetSelector, nextStepIndex, start) => {
      const interval = setInterval(() => {
        const targetElement = document.querySelector(targetSelector);
        const currentValue = getNumberOfItems(nextStepIndex);
        console.log('CURRENT:', currentValue);
        if (targetElement && currentValue > start) {
          console.log('HEJSAN');
          clearInterval(interval);
          // callback();
        }
      }, 100); // TODO: add a timeout to this
    }; */

  const handleToggleStep = useCallback(
    // TODO: Add timeout for this function so the tour doesn't get completely stuck
    (
      nextStepIndex: number,
      target: string,
      parent?: string,
      _idPrefix?: string,
      _start?: number,
      _waitFor?: (
        parent?: string,
        nextStepIndex?: number,
        start?: number,
      ) => void,
    ) => {
      // Check if the target element of the next step is mounted before advancing
      const targetElement = document.querySelector(target);

      if (targetElement && !parent) {
        // waitFor?.(parent, nextStepIndex, start);
        console.log('NOT PARENT');
        setActiveTourStep(nextStepIndex);
      } else {
        // console.log('Observer enter');
        // Wait for the target element to be mounted using MutationObserver

        const observer = new MutationObserver((mutationsList) => {
          // console.log('MutationListLength', mutationsList.length);
          // eslint-disable-next-line no-restricted-syntax
          for (const mutation of mutationsList) {
            // console.log('PArent', parent);
            // console.log('Mutation', mutation);
            if (parent) {
              /* console.log(
                'Parent if',
                parent &&
                  mutation.type === 'childList' &&
                  mutation.addedNodes.length > 0,
              );
              console.log('Mutation type', mutation.type);
              console.log('AddedNodes', mutation.addedNodes); */
            }

            /* if (
              parent &&
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              console.log('PARENTPARENT', mutation.addedNodes);
              observer.disconnect();

              // waitFor?.(parent, nextStepIndex, start);
              setActiveTourStep(nextStepIndex);
              return;
            } */

            const fun = document.querySelector(
              '#ownedItems > div:nth-child(1) > div',
            );

            if (mutation.type === 'childList') {
              const firstRowElement = fun?.querySelector('.ag-row');
              const actions = fun?.querySelector('[id^=cell-actions-]');
              if (parent && firstRowElement && actions) {
                // Step 4: Perform your logic for the first row
                console.log('First', firstRowElement);
                observer.disconnect();

                // waitFor?.(parent, nextStepIndex, start);
                console.log('NextStepIndex', nextStepIndex);
                setActiveTourStep(nextStepIndex);
                console.log('First row element', firstRowElement);
                console.log('RETURN');
                return;
              }
              // eslint-disable-next-line no-restricted-syntax
              for (const addedNode of mutation.addedNodes) {
                if (
                  addedNode.nodeType === Node.ELEMENT_NODE &&
                  ((addedNode as Element).matches(target) ||
                    (parent &&
                      (addedNode as Element).matches(
                        'ag-row-even:nth-child(1)',
                      )))
                ) {
                  console.log('TARGEEET-ID', (addedNode as Element).role);
                  console.log(
                    'First,',
                    addedNode.nodeType === Node.ELEMENT_NODE &&
                      (addedNode as Element).matches(target),
                  );
                  console.log('TARGEEET', addedNode);
                  console.log('PArent', parent);
                  observer.disconnect();

                  // waitFor?.(parent, nextStepIndex, start);
                  setActiveTourStep(nextStepIndex);
                  console.log('RETURN');
                  return;
                }
              }
            }
          }
        });

        if (parent) {
          const parentElement = document.querySelector(parent);
          console.log('PArentElement', parentElement);
          if (parentElement) {
            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });
          }
        } else {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
    },
    [],
  );

  const handleJoyrideCallback = useCallback(
    (data) => {
      const { action, index, status, type } = data;
      console.log('Current target:', steps[index].target);

      if (action === ACTIONS.CLOSE) {
        closeTour?.();
      }

      /* const cookieBannerElement = document.querySelector(
          '#root > div.css-ab8yd1 > main > div.cookie-container-className', // TODO get dimensions of cookie banner
        ) as HTMLElement;
        const { top, left, width, height } =
          cookieBannerElement.getBoundingClientRect();
        console.log('cookiebanner', top, left, width, height); */

      const start = 0;
      if (steps[index + 1]?.shouldIncrease) {
        // start = getNumberOfItems(index + 1);
        console.log('START:', start);
      }

      if (
        steps[index]?.requireClick &&
        (
          document.querySelector(
            steps[index]?.clickTarget ?? steps[index]?.target,
          ) as HTMLButtonElement
        )?.disabled
      ) {
        setNextButtonSetting('hidden');
      } else if (steps[index]?.nextButtonSetting) {
        setNextButtonSetting(steps[index]?.nextButtonSetting as string);
      } else {
        setNextButtonSetting('');
      }

      if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
        // Update state to advance the tour
        const isNextStep = steps.length > index + 1;
        console.log(steps[index].target);
        if (
          action === ACTIONS.NEXT &&
          isNextStep &&
          steps[index + 1].itemIdTarget
        ) {
          const idElement = document.querySelector(
            steps[index + 1].itemIdTarget as string,
          );
          console.log(idElement);
          handleItemId(
            idElement?.id as string,
            steps[index + 1].itemIdPrefix as string,
          );
        }

        if (
          action === ACTIONS.NEXT &&
          isNextStep &&
          steps[index].requireClick &&
          !steps[index].altClickTarget // TODO for cookies banner, solve in a nicer way
        ) {
          console.log('RequireClick place');
          const clickTarget = steps[index].clickTarget ?? steps[index].target;
          (document.querySelector(clickTarget) as HTMLElement)?.click(); // TODO would be faster to use getElementById, if all steps are id's

          handleToggleStep(
            index + 1,
            steps[index + 1].target,
            steps[index + 1].parent,
            steps[index + 1].itemIdPrefix,
            // start,
            // waitForIncreaseElement,
          );
        } else if (isNextStep && action === ACTIONS.NEXT) {
          console.log('Default place');
          handleToggleStep(
            index + 1,
            steps[index + 1].target,
            steps[index + 1].itemIdPrefix,
          );
        } else if (action === ACTIONS.NEXT) {
          closeTour?.(); // TODO: better way to close the tour when finished
          callbackOnComplete?.();
        } else if (action === ACTIONS.PREV && steps[index].clickForBackTarget) {
          const backElement = document.querySelector(
            steps[index].clickForBackTarget ?? '',
          ) as HTMLElement;
          backElement?.click();
          console.log('12');
          handleToggleStep(index - 1, steps[index - 1].target);
        } else if (action === ACTIONS.PREV) {
          console.log('13');
          handleToggleStep(index - 1, steps[index - 1].target);
        }
      } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        // Need to set our running state to false, so we can restart if we click start again.
        closeTour?.();
        // callbackOnComplete?.();
      }
    },
    [steps, tourSteps, handleToggleStep],
  );

  useEffect(() => {
    const handleTargetClick = () => {
      if (activeTourStep + 1 < steps.length) {
        waitForTargetElement(steps[activeTourStep + 1].target, () => {
          console.log('15');
          handleToggleStep(
            activeTourStep + 1,
            steps[activeTourStep + 1].target,
            steps[activeTourStep + 1].parent,
          ); // TODO: this might be enough now without the waitFor
        });
      }
    };

    const currentStep = steps[activeTourStep];

    // To be able to step forward in the tour by pressing the target button
    if (currentStep && currentStep.requireClick) {
      // Attach click event listener to the target component
      const targetElement = document.querySelector(
        currentStep.clickTarget ?? currentStep.target,
      );
      targetElement?.addEventListener('click', handleTargetClick);

      if (currentStep.altClickTarget) {
        // TODO: code this nicer
        const targetElement2 = document.querySelector(
          currentStep.altClickTarget,
        );
        targetElement2?.addEventListener('click', handleTargetClick);
      }
    }

    return () => {
      if (currentStep && currentStep.requireClick) {
        // TODO: check if this will actually clean up right eventlisterns
        // Clean up the click event listener when the step changes
        const targetElement = document.querySelector(
          currentStep.clickTarget ?? currentStep.target,
        );
        targetElement?.removeEventListener('click', handleTargetClick);

        if (currentStep.altClickTarget) {
          const targetElement2 = document.querySelector(
            currentStep.altClickTarget,
          );
          targetElement2?.removeEventListener('click', handleTargetClick);
        }
      }
    };
  }, [activeTourStep, steps, handleToggleStep]);

  /* useEffect(() => {
    setIsTourReady(false);
    const newSteps = mainTourSteps(itemId);
    console.log('itemId:', itemId);
    console.log('newSteps:', newSteps);
    setSteps(newSteps); // Start the tour automatically
    console.log('steps:', steps);
    console.log('id: ', itemId);
    setIsTourReady(true);
  }, [itemId]); */

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    run ? openTour?.() : closeTour?.(); // Start the tour automatically
  }, [run]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (manualRun) {
      setActiveTourStep(0);
    }
  }, [manualRun]);

  return (
    <>
      <Joyride
        steps={steps}
        run={run && isTourOpen}
        continuous
        debug
        styles={{
          options: {
            spotlightShadow: '0 0 15px rgba(255, 0, 0, 1)',
            zIndex: 1500, // TODO: Get zIndex dynamically
          },
          buttonNext: {
            visibility: nextButtonSetting === 'hidden' ? 'hidden' : 'visible',
          },
        }}
        locale={{
          skip: 'Close', // To only use either Close or Skip, since it's not really clear what the difference is between them
          next: nextButtonSetting === 'skipStep' ? 'Skip step' : 'Next',
        }}
        showProgress
        hideCloseButton // to only show skip button
        showSkipButton
        disableOverlayClose
        stepIndex={activeTourStep}
        callback={handleJoyrideCallback}
      />
      {children}
    </>
  );
};

export default Tour;
