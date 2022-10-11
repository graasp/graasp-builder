import '@uppy/drag-drop/dist/style.css';
import { DragDrop } from '@uppy/react';

import { Container, styled } from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FILE_UPLOAD_MAX_FILES, HEADER_HEIGHT } from '../../config/constants';
import { UPLOADER_ID } from '../../config/selectors';
import { UppyContext } from './UppyContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'none',
  height: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  position: 'absolute',
  top: 0,
  padding: `${HEADER_HEIGHT + theme.spacing(3)}px ${theme.spacing(
    3,
  )}px ${theme.spacing(3)}px`,
  left: 0,
  // show above drawer
  zIndex: theme.zIndex.drawer + 1,
  opacity: 0.8,

  '& div': {
    width: '100%',
  },
}));

const FileUploader = () => {
  const { uppy } = useContext(UppyContext);
  const [isDragging, setIsDragging] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { t } = useTranslation();

  const closeUploader = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    uppy?.on('files-added', () => {
      closeUploader();
    });
  }, [uppy]);

  const handleWindowDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    closeUploader();
  };

  const handleDragEnter = (event) => {
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

      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = () => {
    // todo: trigger error that only MAX_FILES was uploaded
    // or cancel drop
    closeUploader();
  };

  if (!uppy) {
    return null;
  }

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
      onDragEnd={(e) => handleDragEnd(e)}
      onDragLeave={(e) => handleDragEnd(e)}
      onDrop={handleDrop}
    >
      <DragDrop
        uppy={uppy}
        note={t(`You can upload up to FILE_UPLOAD_MAX_FILES files at a time`, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
        })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: `${t('Drop here or')} %{browse}`,
            // Used as the label for the link that opens the system file selection dialog.
            browse: t('Browse'),
          },
        }}
      />
    </StyledContainer>
  );
};

export default FileUploader;
