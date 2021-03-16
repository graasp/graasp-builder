import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { buildFileVideoId } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  video: {
    maxWidth: '100%',
  },
}));

const FileVideo = ({ id, url, type }) => {
  const classes = useStyles();
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video className={classes.video} id={buildFileVideoId(id)} controls>
      <source src={url} type={type} />
    </video>
  );
};

FileVideo.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default FileVideo;
