import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_ANALYZER_HEIGHT,
  buildGraaspAnalyzerLink,
} from '../../config/constants';
import { buildGraaspAnalyzerId } from '../../config/selectors';

// todo: use as component
const GraaspAnalyzer = ({ item }) => {
  const { t } = useTranslation();
  const ref = useRef();
  const id = item.get('id');

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
