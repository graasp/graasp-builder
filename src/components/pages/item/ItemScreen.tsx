import { useOutletContext } from 'react-router-dom';

import { ItemType } from '@graasp/sdk';

import FileUploader from '@/components/file/FileUploader';
import ItemContent from '@/components/item/ItemContent';
import ItemMain from '@/components/item/ItemMain';

import { OutletType } from './type';

const ItemPage = (): JSX.Element => {
  const { item } = useOutletContext<OutletType>();

  return (
    <>
      {item.type === ItemType.FOLDER && <FileUploader />}
      <ItemMain item={item}>
        <ItemContent />
      </ItemMain>
    </>
  );
};

export default ItemPage;
