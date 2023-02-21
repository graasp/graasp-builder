import { FC, useEffect } from 'react';

import { Context } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import {
  DEFAULT_ANALYZER_HEIGHT,
  buildGraaspAnalyzerLink,
} from '../../config/constants';
import { useEnumsTranslation } from '../../config/i18n';
import { buildGraaspAnalyzerId } from '../../config/selectors';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  item: ItemRecord;
};

// todo: use as component
const GraaspAnalyzer: FC<Props> = ({ item }) => {
  const { t } = useEnumsTranslation();
  const { setOpenedActionTabId } = useLayoutContext();
  const { id } = item;

  // close tab on unmount
  useEffect(
    () => () => {
      setOpenedActionTabId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <iframe
      /* todo: dynamic height */
      height={DEFAULT_ANALYZER_HEIGHT}
      title={`Graasp ${t(Context.ANALYTICS)}`}
      src={buildGraaspAnalyzerLink(id)}
      id={buildGraaspAnalyzerId(id)}
      style={{ border: '0px' }}
    />
  );
};

export default GraaspAnalyzer;
