import React from 'react';
import PropTypes from 'prop-types';
import { EditItemModalProvider } from './EditItemModalContext';
import { CopyItemModalProvider } from './CopyItemModalContext';
import { MoveItemModalProvider } from './MoveItemModalContext';
import { ShareItemModalProvider } from './ShareItemModalContext';
import { ItemLayoutModeProvider } from './ItemLayoutModeContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';

const ModalProviders = ({ children }) => (
  <EditItemModalProvider>
    <CopyItemModalProvider>
      <MoveItemModalProvider>
        <ShareItemModalProvider>
          <CreateShortcutModalProvider>
            <ItemLayoutModeProvider>{children}</ItemLayoutModeProvider>
          </CreateShortcutModalProvider>
        </ShareItemModalProvider>
      </MoveItemModalProvider>
    </CopyItemModalProvider>
  </EditItemModalProvider>
);

ModalProviders.propTypes = {
  children: PropTypes.node,
};

ModalProviders.defaultProps = {
  children: null,
};

export default ModalProviders;
