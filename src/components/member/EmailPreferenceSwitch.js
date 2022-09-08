import React from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import { FormControl, Select } from '@material-ui/core';
import { useMutation } from '../../config/queryClient';
import { emailFrequency } from '../../config/constants';

const EmailPreferenceSwitch = ({ id, memberId, emailFreq }) => {
  const { mutate: editMember } = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  const handleChange = (event) => {
    editMember({
      id: memberId,
      extra: {
        emailFreq: event.target.value,
      },
    });
  };

  return (
    <FormControl>
      <Select id={id} native value={emailFreq} onChange={handleChange}>
        {Object.entries(emailFrequency).map(([freq, name]) => (
          <option value={freq}>{name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

EmailPreferenceSwitch.propTypes = {
  id: PropTypes.string,
  memberId: PropTypes.string.isRequired,
  emailFreq: PropTypes.string.isRequired,
};

EmailPreferenceSwitch.defaultProps = {
  id: null,
};

export default EmailPreferenceSwitch;
