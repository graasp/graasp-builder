import { FormControl, Select, SelectChangeEvent } from '@mui/material';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { langs } from '@graasp/translations';

import { useMutation } from '../../config/queryClient';

type Props = {
  id?: string;
  memberId: string;
  lang: string;
};

const LanguageSwitch: FC<Props> = ({ id, memberId, lang }) => {
  const { mutate: editMember } = useMutation<
    any,
    any,
    { id: string; extra: { lang: string } }
  >(MUTATION_KEYS.EDIT_MEMBER);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    editMember({
      id: memberId,
      extra: {
        lang: event.target.value as string,
      },
    });
  };

  return (
    <FormControl>
      <Select id={id} native value={lang} onChange={handleChange}>
        {Object.entries(langs).map(([l, name]) => (
          <option value={l} key={l}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitch;
