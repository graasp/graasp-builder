import { Stack } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import DescriptionForm from './DescriptionForm';
import FolderThumbnail from './FolderThumbnail';
import NameForm from './NameForm';

export type FolderFormProps = {
  item?: DiscriminatedItem;
  setChanges: (
    payload: Partial<DiscriminatedItem> & { thumbnail?: Blob },
  ) => void;
  updatedProperties: Partial<DiscriminatedItem> & { thumbnail?: Blob };
};

const FolderForm = ({
  item,
  updatedProperties,
  setChanges,
}: FolderFormProps): JSX.Element => (
  <Stack direction="column" gap={2}>
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-end"
      gap={3}
    >
      <FolderThumbnail setChanges={setChanges} />
      <NameForm
        required
        setChanges={setChanges}
        item={item}
        updatedProperties={updatedProperties}
      />
    </Stack>
    <DescriptionForm
      id={FOLDER_FORM_DESCRIPTION_ID}
      item={item}
      updatedProperties={updatedProperties}
      setChanges={setChanges}
    />
  </Stack>
);

export default FolderForm;
