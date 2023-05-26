import React, { useContext, useEffect } from 'react';

import { Step, TourContext } from './TourContext';

// import steps from './TourSteps.json';

type TourStepProps = {
  step: Step;
  children: React.ReactElement;
};

const TourStep: React.FC<TourStepProps> = ({ step, children }) => {
  const { addTourStep } = useContext(TourContext);

  useEffect(() => {
    addTourStep(step); // logic for filtering out the old tour step is in the context
  }, [step, addTourStep]);

  return children;
};

export default TourStep;
