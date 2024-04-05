import { Box } from '@mui/material';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import DescriptionForm from './DescriptionForm';
import { EditModalContentPropType } from './EditModalWrapper';
import NameForm from './NameForm';

const BaseItemForm = ({
  item,
  updatedProperties,
  setChanges,
}: EditModalContentPropType): JSX.Element => (
  <Box overflow="auto">
    <NameForm
      setChanges={setChanges}
      item={item}
      required
      updatedProperties={updatedProperties}
    />

    <Box sx={{ mt: 2 }}>
      <DescriptionForm
        id={FOLDER_FORM_DESCRIPTION_ID}
        item={item}
        updatedProperties={updatedProperties}
        setChanges={setChanges}
      />
    </Box>
  </Box>
);

export default BaseItemForm;
