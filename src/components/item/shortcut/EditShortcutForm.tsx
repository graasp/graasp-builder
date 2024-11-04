import { ReactNode, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DiscriminatedItem } from '@graasp/sdk';

import { ItemNameField } from '../form/ItemNameField';

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
  const methods = useForm<Inputs>({
    defaultValues: { name: item.name },
  });
  const { watch } = methods;

  const name = watch('name');

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <FormProvider {...methods}>
      <ItemNameField required />
    </FormProvider>
  );
}

export default EditShortcutForm;
