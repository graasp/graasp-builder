import { CopyItemModalProvider } from './CopyItemModalContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { MoveItemModalProvider } from './MoveItemModalContext';
import { SelectItemModalProvider } from './SelectItemModalContext';

type Props = { children: JSX.Element };

const ModalProviders = ({ children }: Props): JSX.Element => (
  <LayoutContextProvider>
    <CopyItemModalProvider>
      <SelectItemModalProvider>
        <MoveItemModalProvider>
          <CreateShortcutModalProvider>
            <FlagItemModalProvider>{children}</FlagItemModalProvider>
          </CreateShortcutModalProvider>
        </MoveItemModalProvider>
      </SelectItemModalProvider>
    </CopyItemModalProvider>
  </LayoutContextProvider>
);

export default ModalProviders;
