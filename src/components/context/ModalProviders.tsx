import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';

type Props = { children: JSX.Element };

const ModalProviders = ({ children }: Props): JSX.Element => (
  <LayoutContextProvider>
    <FlagItemModalProvider>{children}</FlagItemModalProvider>
  </LayoutContextProvider>
);

export default ModalProviders;
