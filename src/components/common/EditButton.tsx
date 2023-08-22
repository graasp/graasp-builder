import { useState } from 'react';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { EditButton as GraaspEditButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  EDIT_ITEM_BUTTON_CLASS,
  buildEditButtonId,
} from '../../config/selectors';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import EditModalWrapper, {
  EditModalContentType,
} from '../item/form/EditModalWrapper';
import FileForm from '../item/form/FileForm';
import NameForm from '../item/form/NameForm';

type Props = {
  item: DiscriminatedItem;
};

const EditButton = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    setOpen(true);
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

  return (
    <>
      <EditModalWrapper
        item={item}
        ComponentType={typeToFormComponent()}
        setOpen={setOpen}
        open={open}
      />
      <GraaspEditButton
        tooltip={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
        id={buildEditButtonId(item.id)}
        ariaLabel={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
        className={EDIT_ITEM_BUTTON_CLASS}
        onClick={handleEdit}
      />
    </>
  );
};

export default EditButton;
