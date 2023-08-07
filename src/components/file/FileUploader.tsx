import { DragEventHandler, useContext, useEffect, useState } from 'react';

import { Box, styled } from '@mui/material';

import { MAX_FILE_SIZE } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import '@uppy/drag-drop/dist/style.css';
import { DragDrop } from '@uppy/react';

import {
  DRAWER_WIDTH,
  FILE_UPLOAD_MAX_FILES,
  HEADER_HEIGHT,
} from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { UPLOADER_ID } from '../../config/selectors';
import { humanFileSize } from '../../utils/uppy';
import { useLayoutContext } from '../context/LayoutContext';
import { UppyContext } from './UppyContext';

const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'myProp',
})<{ isMainMenuOpen: boolean }>(({ theme, isMainMenuOpen }) => ({
  display: 'none',
  height: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  // show above drawer
  zIndex: theme.zIndex.drawer + 1,
  opacity: 0.8,

  '& > div': {
    width: '100%',
    height: '100vh',
    boxSizing: 'border-box',
    paddingLeft: `${
      Number(theme.spacing(2).slice(0, -2)) +
      (isMainMenuOpen ? DRAWER_WIDTH : 0)
    }px`,
    paddingTop: `${Number(theme.spacing(2).slice(0, -2)) + HEADER_HEIGHT}px`,
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),

    '& > div': {
      boxSizing: 'border-box',
      height: '100vh',
      // container's top and bottom padding
      paddingBottom: `${
        Number(theme.spacing(4).slice(0, -2)) + HEADER_HEIGHT
      }px`,
    },
  },
}));

const FileUploader = (): JSX.Element | null => {
  const { isMainMenuOpen } = useLayoutContext();
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
      isMainMenuOpen={isMainMenuOpen}
    >
      <DragDrop
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
