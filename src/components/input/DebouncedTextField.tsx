import { useEffect, useState } from 'react';

import { TextField } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { DEBOUNCED_TEXT_FIELD_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

const { useDebounce } = hooks;

export const DEBOUNCE_MS = 1000;

type Props = {
  initialValue?: string;
  placeholder?: string;
  label: string;
  mt?: number;
  required?: boolean;
  emptyValueError?: string;
  onUpdate: (newValue?: string) => void;
};

export const DebouncedTextField = ({
  initialValue,
  placeholder,
  label,
  mt,
  required = false,
  emptyValueError,
  onUpdate,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  // prevent to call onUpdate when initialValue changed
  const [startDebounce, setStartDebounce] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const debouncedValue = useDebounce(value, DEBOUNCE_MS);

  const isValid = (newValue?: string) => {
    if (!required) {
      return true;
    }

    return Boolean(newValue);
  };

  useEffect(() => {
    if (startDebounce && isValid(debouncedValue)) {
      onUpdate(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const updateError = (newValue: string) => {
    if (isValid(newValue)) {
      setError(undefined);
    } else {
      setError(emptyValueError ?? t(BUILDER.DEBOUNCED_TEXTFIELD_EMPTY_ERROR));
    }
  };

  const handleValueUpdated = (newValue: string) => {
    setValue(newValue);
    setStartDebounce(true);
    updateError(newValue);
  };

  return (
    <TextField
      // It is difficult to get the textarea from the data-cy, so we use the ID here
      id={DEBOUNCED_TEXT_FIELD_ID}
      fullWidth
      multiline
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleValueUpdated(e.target.value)}
      sx={{ bgcolor: 'transparent', mt }}
      error={Boolean(error)}
      helperText={error}
    />
  );
};

export default DebouncedTextField;
