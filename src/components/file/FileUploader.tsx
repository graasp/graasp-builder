import { DragEventHandler, useContext, useEffect, useState } from 'react';

import { Box, styled } from '@mui/material';

import { MAX_FILE_SIZE } from '@graasp/sdk';

import '@uppy/drag-drop/dist/style.css';
import { DragDrop } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { humanFileSize } from '../../utils/uppy';
import { UppyContext } from './UppyContext';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'none',

  // used to position the uppy container above the rest of the content
  position: 'absolute',
  // sets the borders of the container to stick to the border of the parent
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,

  boxSizing: 'border-box',

  // show above drawer
  zIndex: theme.zIndex.drawer + 1,
  opacity: 0.8,
}));

const StyledDragDrop = styled(DragDrop)(({ theme }) => ({
  // sets uppy to stretch to full width
  width: '100%',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  // these styles are necessary and can not be lifted up
  '& > div': {
    boxSizing: 'border-box',
    height: '100%',
  },
}));

const FileUploader = (): JSX.Element | null => {
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
      onDragEnd={() => handleDragEnd()}
      onDragLeave={() => handleDragEnd()}
      onDrop={handleDrop}
    >
      <StyledDragDrop
        uppy={uppy}
        note={translateBuilder(BUILDER.UPLOAD_FILE_LIMITATIONS_TEXT, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
          maxSize: humanFileSize(MAX_FILE_SIZE),
        })}
        locale={
          i18n.options.resources && {
            strings: i18n.options.resources[i18n.language],
          }
        }
      />
    </StyledContainer>
  );
};

export default FileUploader;
