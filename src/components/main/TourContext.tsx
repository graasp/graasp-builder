import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Joyride, {
  ACTIONS,
  EVENTS,
  Step as JoyrideStep,
  STATUS,
} from 'react-joyride';

import { steps as mainTourSteps } from './mainTour';

export type Step = JoyrideStep & {
  target: string;
  timestamp: string;
  requireClick?: boolean;
};

type TourContextData = {
  tourSteps: Step[];
  addTourStep: (step: Step) => void;
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
  const [steps] = useState<Step[]>(mainTourSteps);
  const [activeTourStep, setActiveTourStep] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const addTourStep = useCallback((step: Step) => {
    setTourSteps((prevSteps) => [
      ...prevSteps.filter((s) => s.target !== step.target),
      { ...step, disableBeacon: true },
    ]);
  }, []);

  const contextValue = useMemo(
    // maybe don't have to add it to context every time, only if timestamp is less than last login
    () => ({
      tourSteps,
      addTourStep,
    }),
    [tourSteps, addTourStep],
  );

  const handleJoyrideCallback = useCallback(
    (data) => {
      const { action, index, status, type } = data;

      if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
        // Update state to advance the tour
        const isNextStep = steps.length > index + 1;

        if (
          action === ACTIONS.NEXT &&
          isNextStep &&
          steps[index].requireClick
        ) {
          document.getElementById(steps[index].target.slice(1)).click();
          setActiveTourStep(index + 1);
        } else {
          setActiveTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
        }
      } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        // Need to set our running state to false, so we can restart if we click start again.
        setIsTourOpen(false);
      }
    },
    [steps],
  );

  useEffect(() => {
    setIsTourOpen(true); // Start the tour automatically
  }, []);

  return (
    <TourContext.Provider value={contextValue}>
      <Joyride
        steps={mainTourSteps}
        run={run || isTourOpen}
        continuous
        debug
        styles={{
          options: {
            spotlightShadow: '0 0 15px rgba(255, 0, 0, 1)',
            zIndex: 1500,
          },
        }}
        showProgress
        showSkipButton
        stepIndex={activeTourStep}
        callback={handleJoyrideCallback}
      />
      {children}
    </TourContext.Provider>
  );
};

export default TourContext;
