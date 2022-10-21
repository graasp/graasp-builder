import { SelectChangeEvent } from '@mui/material';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Select } from '@graasp/ui';

import { emailFrequency } from '../../config/constants';
import { useMutation } from '../../config/queryClient';
import { buildEmailFrequencyOptionId } from '../../config/selectors';

type EmailPreferenceSwitchProps = {
  id?: string;
  memberId: string;
  emailFreq: string;
};

const EmailPreferenceSwitch: FC<EmailPreferenceSwitchProps> = ({
  id,
  memberId,
  emailFreq,
}) => {
  const { mutate: editMember } = useMutation<
    any,
    any,
    { id: string; extra: { emailFreq: string } }
  >(MUTATION_KEYS.EDIT_MEMBER);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (event.target.value) {
      editMember({
        id: memberId,
        extra: {
          emailFreq: event.target.value as string,
        },
      });
    } else {
      console.error(`The frequency ${event.target.value} is not valid`);
    }
  };

  return (
    <Select
      id={id}
      native
      defaultValue={emailFreq}
      onChange={handleChange}
      buildOptionId={buildEmailFrequencyOptionId}
      variant="standard"
      values={Object.entries(emailFrequency).map(([freq, name]) => ({
        value: freq,
        text: name,
      }))}
    />
  );
};

export default EmailPreferenceSwitch;
