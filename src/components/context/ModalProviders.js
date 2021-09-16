import React from 'react';
import PropTypes from 'prop-types';
import { EditItemModalProvider } from './EditItemModalContext';
import { CopyItemModalProvider } from './CopyItemModalContext';
import { MoveItemModalProvider } from './MoveItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';

const ModalProviders = ({ children }) => (
  <LayoutContextProvider>
    <EditItemModalProvider>
      <CopyItemModalProvider>
        <MoveItemModalProvider>
          <CreateShortcutModalProvider>
            <FlagItemModalProvider>{children}</FlagItemModalProvider>
          </CreateShortcutModalProvider>
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
