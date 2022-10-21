import { RecordOf } from 'immutable';

import { FC, useContext, useEffect } from 'react';

import { Context, Item } from '@graasp/sdk';

import {
  DEFAULT_ANALYZER_HEIGHT,
  buildGraaspAnalyzerLink,
} from '../../config/constants';
import { useEnumsTranslation } from '../../config/i18n';
import { buildGraaspAnalyzerId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

type Props = {
  item: RecordOf<Item>;
};

// todo: use as component
const GraaspAnalyzer: FC<Props> = ({ item }) => {
  const { t } = useEnumsTranslation();
  const { setOpenedActionTabId } = useContext(LayoutContext);
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
      frameBorder="0"
    />
  );
};

export default GraaspAnalyzer;
