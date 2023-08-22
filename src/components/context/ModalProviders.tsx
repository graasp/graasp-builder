import { CopyItemModalProvider } from './CopyItemModalContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { MoveItemModalProvider } from './MoveItemModalContext';

type Props = { children: JSX.Element };

const ModalProviders = ({ children }: Props): JSX.Element => (
  <LayoutContextProvider>
    <CopyItemModalProvider>
      <MoveItemModalProvider>
        <CreateShortcutModalProvider>
          <FlagItemModalProvider>{children}</FlagItemModalProvider>
        </CreateShortcutModalProvider>
      </MoveItemModalProvider>
    </CopyItemModalProvider>
  </LayoutContextProvider>
);

export default ModalProviders;
