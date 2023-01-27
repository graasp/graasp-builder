import { FC, useContext } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { EditButton as GraaspEditButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  EDIT_ITEM_BUTTON_CLASS,
  buildEditButtonId,
} from '../../config/selectors';
import { EditItemModalContext } from '../context/EditItemModalContext';

type Props = {
  item: ItemRecord;
};

const EditButton: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal } = useContext(EditItemModalContext);

  const handleEdit = () => {
    openModal(item);
  };

  return (
    <GraaspEditButton
      tooltip={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
      id={buildEditButtonId(item.id)}
      ariaLabel={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
      className={EDIT_ITEM_BUTTON_CLASS}
      onClick={handleEdit}
    />
  );
};

export default EditButton;
