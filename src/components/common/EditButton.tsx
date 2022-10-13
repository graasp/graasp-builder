import { RecordOf } from 'immutable';

import { FC, useContext } from 'react';

import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { EditButton as GraaspEditButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  EDIT_ITEM_BUTTON_CLASS,
  buildEditButtonId,
} from '../../config/selectors';
import { EditItemModalContext } from '../context/EditItemModalContext';

type Props = {
  item: RecordOf<Item> | Item;
};

const EditButton: FC<Props> = ({ item }) => {
  const { t } = useBuilderTranslation();
  const { openModal } = useContext(EditItemModalContext);

  const handleEdit = () => {
    openModal(item);
  };

  return (
    <GraaspEditButton
      tooltip={t(BUILDER.EDIT_ITEM_BUTTON)}
      id={buildEditButtonId(item.id)}
      ariaLabel={t(BUILDER.EDIT_ITEM_BUTTON)}
      className={EDIT_ITEM_BUTTON_CLASS}
      onClick={handleEdit}
    />
  );
};

export default EditButton;
