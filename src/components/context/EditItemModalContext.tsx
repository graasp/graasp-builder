import { createContext, useMemo, useState } from 'react';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import EditModalWrapper, {
  EditModalContentType,
} from '../item/form/EditModalWrapper';
import FileForm from '../item/form/FileForm';
import NameForm from '../item/form/NameForm';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const EditItemModalContext = createContext({
  openModal: (_newItem: DiscriminatedItem) => {
    // do nothing
  },
});

const EditItemModalProvider = ({ children }: Props): JSX.Element => {
  const [item, setItem] = useState<DiscriminatedItem | null>(null);
  const [open, setOpen] = useState(false);

  const openModal = (newItem: DiscriminatedItem) => {
    setOpen(true);
    setItem(newItem);
  };

  const typeToFormComponent = (): EditModalContentType => {
    switch (item?.type) {
      case ItemType.DOCUMENT:
        return DocumentForm;
      case ItemType.LOCAL_FILE:
      case ItemType.S3_FILE:
        return FileForm;
      case ItemType.SHORTCUT:
        return NameForm;
      case ItemType.FOLDER:
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.ETHERPAD:
      case ItemType.H5P:
      default:
        return BaseItemForm;
    }
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <EditItemModalContext.Provider value={value}>
      {item && (
        <EditModalWrapper
          item={item}
          setItem={setItem}
          ComponentType={typeToFormComponent()}
          setOpen={setOpen}
          open={open}
        />
      )}
      {children}
    </EditItemModalContext.Provider>
  );
};

export { EditItemModalProvider, EditItemModalContext };
