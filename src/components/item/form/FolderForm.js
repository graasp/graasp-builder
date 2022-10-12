import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { TextEditor } from '@graasp/ui';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import BaseItemForm from './BaseItemForm';

const FolderForm = ({ onChange, item, updatedProperties }) => {
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

FolderForm.propTypes = {
  updatedProperties: PropTypes.shape({
    extra: PropTypes.shape({
      image: PropTypes.string,
    }),
    description: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    extra: PropTypes.shape({
      image: PropTypes.string,
    }),
  }),
};

FolderForm.defaultProps = {
  item: {},
  updatedProperties: {},
};

export default FolderForm;
