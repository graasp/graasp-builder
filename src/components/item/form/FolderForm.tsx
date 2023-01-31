import Box from '@mui/material/Box';

import { Item } from '@graasp/sdk';
import { TextEditor } from '@graasp/ui';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import BaseItemForm from './BaseItemForm';

type Props = {
  onChange: (item: Partial<Item>) => void;
  item: Partial<Item>;
  updatedProperties: Partial<Item>;
};

const FolderForm = ({
  onChange,
  item,
  updatedProperties,
}: Props): JSX.Element => {
  const onCaptionChange = (content) => {
    onChange({
      ...updatedProperties,
      description: content,
    });
  };

  return (
    <>
      <BaseItemForm
        onChange={onChange}
        item={item}
        updatedProperties={updatedProperties}
      />

      <Box sx={{ mt: 2 }}>
        <TextEditor
          id={FOLDER_FORM_DESCRIPTION_ID}
          value={updatedProperties?.description || item?.description}
          edit
          onChange={onCaptionChange}
          showActions={false}
        />
      </Box>
    </>
  );
};

export default FolderForm;
