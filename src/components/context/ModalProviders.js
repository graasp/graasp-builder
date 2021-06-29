import React from 'react';
import PropTypes from 'prop-types';
import { EditItemModalProvider } from './EditItemModalContext';
import { CopyItemModalProvider } from './CopyItemModalContext';
import { MoveItemModalProvider } from './MoveItemModalContext';
import { ShareItemModalProvider } from './ShareItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';

const ModalProviders = ({ children }) => (
  <LayoutContextProvider>
    <EditItemModalProvider>
      <CopyItemModalProvider>
        <MoveItemModalProvider>
          <ShareItemModalProvider>
            <CreateShortcutModalProvider>
              {children}
            </CreateShortcutModalProvider>
          </ShareItemModalProvider>
        </MoveItemModalProvider>
      </CopyItemModalProvider>
    </EditItemModalProvider>
  </LayoutContextProvider>
);

ModalProviders.propTypes = {
  children: PropTypes.node,
};

ModalProviders.defaultProps = {
  children: null,
};

export default ModalProviders;
