import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

import { Step, steps as mainTourSteps } from './mainTour';

export type TourContextData = {
  isTourOpen: boolean;
  tourSteps: Step[];
  addTourStep: (step: Step) => void;
  removeTourStep: (step: Step) => void;
};

type TourProps = {
  children: React.ReactElement;
  run?: boolean;
};

export const TourContext = React.createContext<TourContextData | undefined>(
  undefined,
);

export const Tour: React.FC<TourProps> = ({ children, run }) => {
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  const [itemId, setItemId] = useState('');
  const [steps, setSteps] = useState<Step[]>(mainTourSteps(itemId));
  const [activeTourStep, setActiveTourStep] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isTourReady, setIsTourReady] = useState(true);

  const addTourStep = useCallback((step: Step) => {
    setTourSteps((prevSteps) => {
      const newStep = { ...step, disableBeacon: true };
      console.log('check add step');
      const stepExists = prevSteps.some(
        (s) => JSON.stringify(s) === JSON.stringify(newStep), // since order of properties will always be the same
      );
      console.log('PRevSteps:', prevSteps);
      console.log('StepExists??', stepExists);
      if (stepExists) {
        return prevSteps; // If identical step already exists, return the previous steps
      }
      console.log('addsStep', step);
      return [...prevSteps.filter((s) => s.target !== step.target), newStep];
    });
  }, []);

  const removeTourStep = useCallback((step: Step) => {
    setTourSteps((prevSteps) => [
      ...prevSteps.filter((s) => s.target !== step.target),
    ]);
  }, []);

  const contextValue = useMemo(
    // maybe don't have to add it to context every time, only if timestamp is less than last login
    () => ({
      isTourOpen,
      tourSteps,
      addTourStep,
      removeTourStep,
    }),
    [tourSteps, addTourStep, removeTourStep, isTourOpen],
  );

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
        setActiveTourStep(nextStepIndex);
      } else {
        // Wait for the target element to be mounted using MutationObserver
        const observer = new MutationObserver((mutationsList) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const mutation of mutationsList) {
            if (
              parent &&
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              console.log('PARENTPARENT');
              observer.disconnect();

              // waitFor?.(parent, nextStepIndex, start);
              setActiveTourStep(nextStepIndex);
              return;
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const addedNode of mutation.addedNodes) {
              if (
                addedNode.nodeType === Node.ELEMENT_NODE &&
                (addedNode as Element).matches(target)
              ) {
                observer.disconnect();

                // waitFor?.(parent, nextStepIndex, start);
                setActiveTourStep(nextStepIndex);
                return;
              }
            }
          }
        });

        if (parent) {
          const parentElement = document.querySelector(parent);
          if (parentElement) {
            observer.observe(parentElement, {
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
        setIsTourOpen(false);
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
            steps[index + 1].itemIdTarget ?? '',
          );
          console.log(idElement);
          handleItemId(
            idElement?.id ?? '',
            steps[index + 1].itemIdPrefix ?? '',
          );
        }

        if (
          action === ACTIONS.NEXT &&
          isNextStep &&
          steps[index].requireClick
        ) {
          const clickTarget = steps[index].clickTarget ?? steps[index].target;
          (document.querySelector(clickTarget) as HTMLElement)?.click(); // TODO would be faster to use getElementById, if all steps are id's

          handleToggleStep(
            index + 1,
            steps[index + 1].target,
            steps[index + 1].parent,
            start,
            // waitForIncreaseElement,
          );
        } else if (isNextStep && action === ACTIONS.NEXT) {
          handleToggleStep(
            index + 1,
            steps[index + 1].target,
            steps[index + 1].itemIdPrefix,
          );
        } else if (action === ACTIONS.NEXT) {
          setIsTourOpen(false); // TODO: better way to close the tour when finished
        } else if (action === ACTIONS.PREV && steps[index].clickForBackTarget) {
          const backElement = document.querySelector(
            steps[index].clickForBackTarget ?? '',
          ) as HTMLElement;
          backElement?.click();
          handleToggleStep(index - 1, steps[index - 1].target);
        } else if (action === ACTIONS.PREV) {
          handleToggleStep(index - 1, steps[index - 1].target);
        }
      } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        // Need to set our running state to false, so we can restart if we click start again.
        setIsTourOpen(false);
      }
    },
    [steps, tourSteps, handleToggleStep],
  );

  useEffect(() => {
    const handleTargetClick = () => {
      if (activeTourStep + 1 < steps.length) {
        waitForTargetElement(steps[activeTourStep + 1].target, () => {
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
    }

    return () => {
      if (currentStep && currentStep.requireClick) {
        // TODO: check if this will actually clean up right eventlisterns
        // Clean up the click event listener when the step changes
        const targetElement = document.querySelector(
          currentStep.clickTarget ?? currentStep.target,
        );
        targetElement?.removeEventListener('click', handleTargetClick);
      }
    };
  }, [activeTourStep, steps, handleToggleStep]);

  useEffect(() => {
    setIsTourReady(false);
    const newSteps = mainTourSteps(itemId);
    console.log('itemId:', itemId);
    console.log('newSteps:', newSteps);
    setSteps(newSteps); // Start the tour automatically
    console.log('steps:', steps);
    console.log('id: ', itemId);
    setIsTourReady(true);
  }, [itemId]);

  useEffect(() => {
    setIsTourOpen(true); // Start the tour automatically
  }, []);

  return (
    <TourContext.Provider value={contextValue}>
      {isTourReady && (
        <Joyride
          steps={steps}
          run={run || isTourOpen}
          continuous
          debug
          styles={{
            options: {
              spotlightShadow: '0 0 15px rgba(255, 0, 0, 1)',
              zIndex: 1500, // TODO: Get zIndex dynamically
            },
          }}
          showProgress
          showSkipButton
          spotlightClicks
          stepIndex={activeTourStep}
          callback={handleJoyrideCallback}
        />
      )}
      {children}
    </TourContext.Provider>
  );
};

export default TourContext;
