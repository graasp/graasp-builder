import { Box } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import DescriptionForm from './DescriptionForm';
import DisplayNameForm from './DisplayNameForm';
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
  <>
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="flex-end"
      gap={2}
    >
      <FolderThumbnail setChanges={setChanges} />
      <NameForm
        required
        setChanges={setChanges}
        item={item}
        updatedProperties={updatedProperties}
      />
      <DisplayNameForm
        setChanges={setChanges}
        updatedProperties={updatedProperties}
      />
    </Box>
    <Box sx={{ mt: 2 }}>
      <DescriptionForm
        id={FOLDER_FORM_DESCRIPTION_ID}
        item={item}
        updatedProperties={updatedProperties}
        setChanges={setChanges}
      />
    </Box>
  </>
);

export default FolderForm;
