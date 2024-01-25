import { useState } from 'react';

import { Dialog } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import {
  ActionButtonVariant,
  EditButton as GraaspEditButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  EDIT_ITEM_BUTTON_CLASS,
  EDIT_MODAL_ID,
  buildEditButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import BaseItemForm from '../item/form/BaseItemForm';
import DocumentForm from '../item/form/DocumentForm';
import EditModalWrapper, {
  EditModalContentType,
} from '../item/form/EditModalWrapper';
import FileForm from '../item/form/FileForm';
import NameForm from '../item/form/NameForm';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const EditButton = ({ item, type = 'icon', onClick }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    setOpen(true);
    onClick?.();
  };

  const typeToFormComponent = (): EditModalContentType => {
    switch (item.type) {
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
      <Dialog id={EDIT_MODAL_ID} open={open} maxWidth="sm" fullWidth>
        <EditModalWrapper
          item={item}
          ComponentType={typeToFormComponent()}
          setOpen={setOpen}
        />
      </Dialog>
      <GraaspEditButton
        tooltip={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
        id={buildEditButtonId(item.id)}
        ariaLabel={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
        className={EDIT_ITEM_BUTTON_CLASS}
        onClick={handleEdit}
        type={type}
      />
    </>
  );
};

export default EditButton;
