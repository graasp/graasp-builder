import { RecordOf } from 'immutable';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { EditButton as GraaspEditButton } from '@graasp/ui';

import {
  EDIT_ITEM_BUTTON_CLASS,
  buildEditButtonId,
} from '../../config/selectors';
import { EditItemModalContext } from '../context/EditItemModalContext';

type Props = {
  item: RecordOf<Item>;
};

const EditButton: FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const { openModal } = useContext(EditItemModalContext);

  const handleEdit = () => {
    openModal(item);
  };

  return (
    <GraaspEditButton
      title={t(BUILDER.EDIT_ITEM_BUTTON)}
      id={buildEditButtonId(item.id)}
      ariaLabel={t(BUILDER.EDIT_ITEM_BUTTON)}
      className={EDIT_ITEM_BUTTON_CLASS}
      onClick={handleEdit}
    />
  );
};

export default EditButton;
