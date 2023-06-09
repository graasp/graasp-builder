import React, { useContext, useEffect } from 'react';

import { TourContext } from './TourContext';
import { Step } from './mainTour';

// import steps from './TourSteps.json';

type TourStepProps = {
  step: Step;
  children: React.ReactElement;
  onTextChange?: (string) => void;
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
  const { addTourStep } = useContext(TourContext);

  useEffect(() => {
    let customStep = step;
    if (onTextChange) customStep = { ...step, onTextChange };
    if (focusModal) customStep = { ...customStep, focusModal };
    if (numberOfItems) customStep = { ...customStep, numberOfItems };

    addTourStep(customStep); // logic for filtering out the old tour step is in the context
  }, [step, addTourStep, onTextChange, focusModal, numberOfItems]);

  return children;
};

export default TourStep;
