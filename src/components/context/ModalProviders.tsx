import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';

type Props = { children: JSX.Element };

const ModalProviders = ({ children }: Props): JSX.Element => (
  <LayoutContextProvider>
    <CreateShortcutModalProvider>
      <FlagItemModalProvider>{children}</FlagItemModalProvider>
    </CreateShortcutModalProvider>
  </LayoutContextProvider>
);

export default ModalProviders;
