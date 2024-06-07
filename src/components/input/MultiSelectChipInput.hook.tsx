import { useEffect, useRef, useState } from 'react';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';
import CaseInsensitiveSet from '@/types/set';

const EMPTY_STRING = '';
const EMPTY_SET = new CaseInsensitiveSet();

type SetOfString = CaseInsensitiveSet;

type Props = {
  data?: string[];
  onChange?: (newValues: string[]) => void;
};

type UseMultiSelectChipInput = {
  values: string[];
  currentValue: string;
  error: string | undefined;
  hasError: boolean;
  hasData: boolean;
  hasChanged: boolean;

  updateValues: (newValues: string[]) => void;
  handleCurrentValueChanged: (newValue: string) => void;
  addValue: () => string[];
  deleteValue: (valueToDelete: string) => string[];
};

export const useMultiSelectChipInput = ({
  data,
  onChange,
}: Props): UseMultiSelectChipInput => {
  const { t } = useBuilderTranslation();
  const originalData = useRef<SetOfString>(EMPTY_SET);
  const [newData, setNewData] = useState<SetOfString>(EMPTY_SET);
  const [currentValue, setCurrentValue] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string | undefined>();

  const hasError = Boolean(error);
  const hasData = newData.size() > 0;
  const hasChanged = !originalData.current.isEqual(newData);

  // sync the props with the component's state
  useEffect(() => {
    const newSet = new CaseInsensitiveSet(data);
    setNewData(newSet);
    originalData.current = newSet;
  }, [data]);

  const valueIsValid = (
    dataToValidate: string | undefined,
  ): dataToValidate is string => Boolean(dataToValidate);

  const valueExist = (newValue: string) => newData.has(newValue);

  const validateData = (newValue: string) => {
    if (valueExist(newValue)) {
      setError(t(BUILDER.CHIPS_ALREADY_EXIST, { element: newValue }));
      return false;
    }
    setError(undefined);
    return true;
  };

  const notifyOnChange = (newValues: string[]) => onChange?.(newValues);

  const addValue = () => {
    if (valueIsValid(currentValue) && !valueExist(currentValue)) {
      const newMapValues = newData.copy([currentValue]);
      setNewData(newMapValues);
      setCurrentValue(EMPTY_STRING);
      notifyOnChange(newMapValues.values());
      return newMapValues.values();
    }

    return newData.values();
  };

  const deleteValue = (valueToDelete: string) => {
    const newMapValues = newData.copy();
    newMapValues.delete(valueToDelete);
    setNewData(newMapValues);
    notifyOnChange(newMapValues.values());
    return newMapValues.values();
  };

  const updateValues = (newValues: string[]) => {
    const newMap = new CaseInsensitiveSet(newValues);
    setNewData(newMap);
    notifyOnChange(newMap.values());
  };

  const handleCurrentValueChanged = (newValue: string) => {
    validateData(newValue);
    setCurrentValue(newValue);
  };

  return {
    values: newData.values(),
    currentValue,
    error,
    hasError,
    hasData,
    hasChanged,
    updateValues,
    handleCurrentValueChanged,
    addValue,
    deleteValue,
  };
};

export default useMultiSelectChipInput;
