import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { DiscriminatedItem } from '@graasp/sdk';

import NameForm from '../form/NameForm';

type Inputs = {
  name: string;
};

function EditShortcutForm({
  item,
  setChanges,
}: {
  item: DiscriminatedItem;
  setChanges: (args: { name: string }) => void;
}): ReactNode {
  const { register, reset, watch } = useForm<Inputs>();

  const name = watch('name');

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <NameForm
      reset={() => reset({ name: '' })}
      nameForm={register('name', { value: item.name })}
    />
  );
}

export default EditShortcutForm;
