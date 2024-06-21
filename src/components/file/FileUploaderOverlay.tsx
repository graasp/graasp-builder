import { DragEventHandler, useEffect, useState } from 'react';

import { Box, styled } from '@mui/material';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { UPLOADER_ID } from '../../config/selectors';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';
import FileUploader from './FileUploader';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'none',

  // used to position the file dropper above the rest of the content
  position: 'absolute',
  // sets the borders of the container to stick to the border of the parent
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,

  margin: theme.spacing(5),

  boxSizing: 'border-box',

  // show above drawer
  zIndex: theme.zIndex.drawer + 1,
  opacity: 0.8,
}));

const FileUploaderOverlay = (): JSX.Element | null => {
  const [isDragging, setIsDragging] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const {
    update,
    close: closeNotification,
    closeAndShowError,
    show,
  } = useUploadWithProgress();

  const closeUploader = () => {
    setIsDragging(false);
  };

  const handleWindowDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    closeUploader();
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
    // detect whether the dragged files number exceeds limit
    if (event?.dataTransfer?.items) {
      const nbFiles = event.dataTransfer.items.length;

      if (nbFiles > FILE_UPLOAD_MAX_FILES) {
        return setIsValid(false);
      }
    }

    return setIsValid(true);
  };

  useEffect(() => {
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('mouseout', handleDragEnd);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('mouseout', handleDragEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = () => {
    // todo: trigger error that only MAX_FILES was uploaded
    // or cancel drop
    closeUploader();
  };

  const buildSx = () => {
    let sx = {};
    if (isDragging) {
      sx = { ...sx, display: 'flex' };
    }
    if (!isValid) {
      sx = {
        ...sx,
        '& div button': {
          backgroundColor: 'red !important',
        },
      };
    }
    return sx;
  };

  return (
    <StyledContainer
      id={UPLOADER_ID}
      sx={buildSx()}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragEnd={() => handleDragEnd()}
      onDragLeave={() => handleDragEnd()}
      onDrop={handleDrop}
    >
      <FileUploader
        onStart={show}
        onComplete={closeNotification}
        onError={closeAndShowError}
        onUpdate={update}
      />
    </StyledContainer>
  );
};

export default FileUploaderOverlay;
