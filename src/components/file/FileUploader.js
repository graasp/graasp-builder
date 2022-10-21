import '@uppy/drag-drop/dist/style.css';
import { DragDrop } from '@uppy/react';

import { Container, styled } from '@mui/material';

import { useContext, useEffect, useState } from 'react';

import { MAX_FILE_SIZE } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { FILE_UPLOAD_MAX_FILES, HEADER_HEIGHT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { UPLOADER_ID } from '../../config/selectors';
import { humanFileSize } from '../../utils/uppy';
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
  const { t: translateBuilder, i18n } = useBuilderTranslation();

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
        note={translateBuilder(BUILDER.UPLOAD_FILE_LIMITATIONS_TEXT, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
          maxSize: humanFileSize(MAX_FILE_SIZE),
        })}
        locale={{
          strings: i18n.options.resources[i18n.language].uppy,
        }}
      />
    </StyledContainer>
  );
};

export default FileUploader;
