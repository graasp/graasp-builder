import { SelectChangeEvent } from '@mui/material';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { langs } from '@graasp/translations';
import { Select } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';
import { buildLanguageOptionId } from '../../config/selectors';

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
    if (event.target.value) {
      editMember({
        id: memberId,
        extra: {
          lang: event.target.value as string,
        },
      });
    } else {
      console.error(`The lang ${event.target.value} is not valid`);
    }
  };

  return (
    <Select
      variant="standard"
      id={id}
      defaultValue={lang}
      onChange={handleChange}
      buildOptionId={buildLanguageOptionId}
      values={Object.entries(langs).map(([value, text]) => ({ value, text }))}
    />
  );
};

export default LanguageSwitch;
