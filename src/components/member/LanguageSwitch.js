import React from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import { FormControl, Select } from '@material-ui/core';
import { langs } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';

const LanguageSwitch = ({ id, memberId, lang }) => {
  const { mutate: editMember } = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  const handleChange = (event) => {
    editMember({
      id: memberId,
      extra: {
        lang: event.target.value,
      },
    });
  };

  return (
    <FormControl>
      <Select id={id} native value={lang} onChange={handleChange}>
        {Object.entries(langs).map(([l, name]) => (
          <option value={l}>{name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

LanguageSwitch.propTypes = {
  id: PropTypes.string,
  memberId: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

LanguageSwitch.defaultProps = {
  id: null,
};

export default LanguageSwitch;
