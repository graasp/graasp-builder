import PropTypes from 'prop-types';

import { CopyItemModalProvider } from './CopyItemModalContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { EditItemModalProvider } from './EditItemModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { MoveItemModalProvider } from './MoveItemModalContext';

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
