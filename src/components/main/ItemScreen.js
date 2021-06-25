import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import { hooks } from '../../config/queryClient';
import ItemMain from '../item/ItemMain';
import { LayoutContext } from '../context/LayoutContext';
import Main from './Main';
import ItemContent from '../item/ItemContent';
import ItemSettings from '../item/settings/ItemSettings';
import ErrorAlert from '../common/ErrorAlert';

const { useItem } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isLoading } = useItem(itemId);

  const { isItemSettingsOpen } = useContext(LayoutContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!itemId || !item) {
    return <ErrorAlert />;
  }

  return (
    <Main>
      <ItemMain item={item}>
        {isItemSettingsOpen ? (
          <ItemSettings item={item} />
        ) : (
          <ItemContent item={item} />
        )}
      </ItemMain>
    </Main>
  );
};

export default ItemScreen;
