import React from 'react';
import PropTypes from 'prop-types';

const FileVideo = ({ url, type }) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video controls>
    <source src={url} type={type} />
  </video>
);

FileVideo.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default FileVideo;
