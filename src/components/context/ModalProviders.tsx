import { CopyItemModalProvider } from './CopyItemModalContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';

type Props = { children: JSX.Element };

const ModalProviders = ({ children }: Props): JSX.Element => (
  <LayoutContextProvider>
    <CopyItemModalProvider>
      <CreateShortcutModalProvider>
        <FlagItemModalProvider>{children}</FlagItemModalProvider>
      </CreateShortcutModalProvider>
    </CopyItemModalProvider>
  </LayoutContextProvider>
);

export default ModalProviders;
