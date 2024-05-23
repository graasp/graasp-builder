import { useSearchParams } from 'react-router-dom';

import { DiscriminatedItem, redirect } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { buildPlayerTabName } from '@/config/selectors';

import MapView from '../item/MapView';

// this page is used by the mobile app to display the map
const MapItemScreen = (): JSX.Element | null => {
  const [urlSearchParams] = useSearchParams();

  const isMobileApp = urlSearchParams.get('isMobileApp') === 'true';
  const enableGeolocation = urlSearchParams.get('enableGeolocation')
    ? urlSearchParams.get('enableGeolocation') === 'true'
    : true;

  const viewItem = (item: DiscriminatedItem) => {
    if (isMobileApp) {
      // todo: replace with universal/deep link? not sure it works inside iframe..
      window.parent.postMessage(
        JSON.stringify({ item, action: 'open-player' }),
      );
    } else {
      redirect(window, buildGraaspPlayerView(item.id), {
        name: buildPlayerTabName(item.id),
        openInNewTab: false,
      });
    }
  };

  return (
    <MapView
      viewItem={viewItem}
      enableGeolocation={enableGeolocation}
      parentId={urlSearchParams.get('parentId') ?? undefined}
    />
  );
};

export default MapItemScreen;
