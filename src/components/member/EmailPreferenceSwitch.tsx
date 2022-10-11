import { FC } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import { FormControl, Select, SelectChangeEvent } from '@mui/material';
import { useMutation } from '../../config/queryClient';
import { emailFrequency } from '../../config/constants';

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
    editMember({
      id: memberId,
      extra: {
        emailFreq: event.target.value as string,
      },
    });
  };

  return (
    <FormControl>
      <Select id={id} native value={emailFreq} onChange={handleChange}>
        {Object.entries(emailFrequency).map(([freq, name]) => (
          <option value={freq} key={name}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default EmailPreferenceSwitch;
