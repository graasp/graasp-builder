import { useOutletContext } from 'react-router-dom';

import ItemContent from '@/components/item/ItemContent';
import ItemMain from '@/components/item/ItemMain';

import { OutletType } from './type';

const ItemPage = (): JSX.Element => {
  const { item } = useOutletContext<OutletType>();
  return (
    <ItemMain item={item}>
      <ItemContent />
    </ItemMain>
  );
};

export default ItemPage;
