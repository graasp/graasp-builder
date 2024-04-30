import { useSearchParams } from 'react-router-dom';

import { DiscriminatedItem, redirect } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { buildPlayerTabName } from '@/config/selectors';

import MapView from '../item/MapView';

// this page is used by the mobile app to display the map
const MapItemScreen = (): JSX.Element | null => {
  const [urlSearchParams] = useSearchParams();

  const isMobileApp = urlSearchParams.get('isMobileApp') === 'true';

  const viewItem = (item: DiscriminatedItem) => {
    if (isMobileApp) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line no-lonely-if
      if (window.ReactNativeWebView) {
        // todo: replace with universal/deep link? not sure it works inside iframe..
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ itemId: item.id, action: 'open-player' }),
          '*',
        );
      } else {
        console.error('cannot open item in mobile player');
      }
    } else {
      redirect(window, buildGraaspPlayerView(item.id), {
        name: buildPlayerTabName(item.id),
        openInNewTab: true,
      });
    }
  };

  return (
    <MapView
      viewItem={viewItem}
      parentId={urlSearchParams.get('parentId') ?? undefined}
    />
  );
};

export default MapItemScreen;
