import React from 'react';
import PropTypes from 'prop-types';
import { buildFilePdfId } from '../../config/selectors';

const FilePdf = ({ url, id }) => (
  <embed id={buildFilePdfId(id)} src={url} width="100%" height="100%" />
);

FilePdf.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default FilePdf;
