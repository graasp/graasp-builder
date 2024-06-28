import { useNavigate } from 'react-router';

import { DiscriminatedItem } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { buildItemPath } from '@/config/paths';

import MapView from '../item/MapView';

type Props = {
  parentId?: DiscriminatedItem['id'];
};

export const DesktopMap = ({ parentId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const viewItem = (item: DiscriminatedItem) => {
    navigate(buildGraaspPlayerView(item.id));
  };

  const viewItemInBuilder = (item: DiscriminatedItem) => {
    navigate(buildItemPath(item.id));
  };

  // todo: improve height
  return (
    <MapView
      parentId={parentId}
      height="65vh"
      viewItem={viewItem}
      viewItemInBuilder={viewItemInBuilder}
    />
  );
};
