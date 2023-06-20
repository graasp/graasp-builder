import React, { ChangeEvent, useContext, useEffect } from 'react';

import { TourContext, TourContextData } from './TourContext';
import { Step } from './mainTour';

// import steps from './TourSteps.json';

type TourStepProps = {
  step: Step;
  children: React.ReactElement;
  onTextChange?:
    | ((content: string) => void)
    | ((event: ChangeEvent<{ value: string }>) => void);
  focusModal?: boolean;
  itemId?: string;
  numberOfItems?: number;
};

const TourStep: React.FC<TourStepProps> = ({
  step,
  children,
  onTextChange,
  focusModal,
  numberOfItems,
}) => {
  const { addTourStep, removeTourStep } = useContext(
    TourContext,
  ) as TourContextData;

  useEffect(() => {
    let customStep = step;
    if (onTextChange) customStep = { ...step, onTextChange };
    if (focusModal) customStep = { ...customStep, focusModal };
    if (numberOfItems) customStep = { ...customStep, numberOfItems };

    addTourStep(customStep); // logic for filtering out the old tour step is in the context

    // no clean up on dismount, since we only have to get the functions etc. ones unless they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, addTourStep, removeTourStep, focusModal, numberOfItems]);

  return children;
};

export default TourStep;
