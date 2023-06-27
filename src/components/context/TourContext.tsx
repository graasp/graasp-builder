import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { HOME_PATH } from '../../config/paths';
import { Step } from '../main/mainTour';

export type TourContextType = {
  isTourOpen: boolean;
  tourSteps?: Step[];
  manualRun?: boolean;
  addTourStep?: (step: Step) => void;
  removeTourStep?: (step: Step) => void;
  openTour?: () => void;
  closeTour?: () => void;
  reRunTour?: () => void;
};

const TourContext = React.createContext<TourContextType | undefined>(undefined);

const TourContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [manualRun, setManualRun] = useState(false);
  const navigate = useNavigate();

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

  const reRunTour = useCallback(() => {
    navigate(HOME_PATH);
    setManualRun(true);
    console.log('Manual run', manualRun);
  }, []);

  const openTour = useCallback(() => {
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    setManualRun(false);
  }, []);

  const contextValue = useMemo(
    // maybe don't have to add it to context every time, only if timestamp is less than last login
    () => ({
      isTourOpen,
      openTour,
      closeTour,
      tourSteps,
      addTourStep,
      removeTourStep,
      manualRun,
      reRunTour,
    }),
    [
      tourSteps,
      addTourStep,
      removeTourStep,
      isTourOpen,
      manualRun,
      reRunTour,
      openTour,
      closeTour,
    ],
  );

  return (
    <TourContext.Provider value={contextValue}>{children}</TourContext.Provider>
  );
};

export const useTourContext = (): TourContextType =>
  useContext(TourContext) as TourContextType;

export { TourContextProvider, TourContext };
