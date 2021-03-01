import React from 'react';
import PropTypes from 'prop-types';

const FileImage = ({ url, alt }) => <img src={url} alt={alt} />;

FileImage.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default FileImage;
