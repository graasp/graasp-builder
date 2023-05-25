import { SelectChangeEvent } from '@mui/material';

import { MemberExtra } from '@graasp/sdk';
import { Select } from '@graasp/ui';

import { emailFrequency } from '../../config/constants';
import { mutations } from '../../config/queryClient';
import { buildEmailFrequencyOptionId } from '../../config/selectors';

type EmailPreferenceSwitchProps = {
  id?: string;
  memberId: string;
  emailFreq: MemberExtra['emailFreq'];
};

const EmailPreferenceSwitch = ({
  id,
  memberId,
  emailFreq,
}: EmailPreferenceSwitchProps): JSX.Element => {
  const { mutate: editMember } = mutations.useEditMember();

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (event.target.value) {
      editMember({
        id: memberId,
        extra: {
          emailFreq: event.target.value as MemberExtra['emailFreq'],
        },
      });
    } else {
      console.error(`The frequency ${event.target.value} is not valid`);
    }
  };

  return (
    <Select
      id={id}
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
