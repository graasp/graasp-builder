import { Loader } from '@graasp/ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { hooks } from '../../config/queryClient';
import ErrorAlert from '../common/ErrorAlert';
import { LayoutContext } from '../context/LayoutContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemSettings from '../item/settings/ItemSettings';
import Main from './Main';

const { useItem } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isLoading, isError } = useItem(itemId);

  const { isItemSettingsOpen } = useContext(LayoutContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!itemId || !item || isError) {
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
