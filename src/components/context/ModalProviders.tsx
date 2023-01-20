import { FC } from 'react';

import { CopyItemModalProvider } from './CopyItemModalContext';
import { CreateShortcutModalProvider } from './CreateShortcutModalContext';
import { EditItemModalProvider } from './EditItemModalContext';
import { FlagItemModalProvider } from './FlagItemModalContext';
import { LayoutContextProvider } from './LayoutContext';
import { MoveItemModalProvider } from './MoveItemModalContext';

type Props = { children: JSX.Element };

const ModalProviders: FC<Props> = ({ children }) => (
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

export default ModalProviders;
