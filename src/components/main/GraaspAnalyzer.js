import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_ANALYZER_HEIGHT,
  buildGraaspAnalyzerLink,
} from '../../config/constants';
import { buildGraaspAnalyzerId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

// todo: use as component
const GraaspAnalyzer = ({ item }) => {
  const { t } = useTranslation();
  const { setIsDashboardOpen } = useContext(LayoutContext);
  const ref = useRef();
  const id = item.get('id');

  // close tab on unmount
  useEffect(
    () => () => {
      setIsDashboardOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <iframe
      ref={ref}
      /* todo: dynamic height */
      height={DEFAULT_ANALYZER_HEIGHT}
      title={t('Graasp Analyzer')}
      src={buildGraaspAnalyzerLink(id)}
      id={buildGraaspAnalyzerId(id)}
      frameBorder="0"
    />
  );
};

GraaspAnalyzer.propTypes = {
  item: PropTypes.instanceOf({
    Map,
  }).isRequired,
};

export default GraaspAnalyzer;
