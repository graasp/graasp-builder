import { useSearchParams } from 'react-router-dom';

import MapView from '../item/MapView';

// this page is used by the mobile app to display the map
const MapItemScreen = (): JSX.Element | null => {
  const [urlSearchParams] = useSearchParams();

  return <MapView parentId={urlSearchParams.get('parentId') ?? undefined} />;
};

export default MapItemScreen;
