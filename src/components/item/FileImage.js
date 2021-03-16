import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { buildFileImageId } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: '100%',
  },
}));

const FileImage = ({ id, url, alt }) => {
  const classes = useStyles();
  return (
    <img
      id={buildFileImageId(id)}
      className={classes.image}
      src={url}
      alt={alt}
    />
  );
};

FileImage.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default FileImage;
