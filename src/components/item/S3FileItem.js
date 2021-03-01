import React, { useEffect, useState } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { getS3FileUrl } from '../../api/item';
import { MIME_TYPES } from '../../config/constants';
import FileImage from './FileImage';
import FileVideo from './FileVideo';

const S3FileItem = ({ item }) => {
  const [url, setUrl] = useState();
  const { contenttype } = item.get('extra');
  const type = item.get('type');
  const id = item.get('id');
  const name = item.get('name');

  useEffect(() => {
    (async () => {
      const itemUrl = await getS3FileUrl({ id, type });
      setUrl(itemUrl);
    })();
  }, [id, type]);

  if (!url) {
    return null;
  }

  if (MIME_TYPES.IMAGE.includes(contenttype)) {
    return <FileImage url={url} alt={name} />;
  }

  if (MIME_TYPES.VIDEO.includes(contenttype)) {
    return <FileVideo url={url} type={contenttype} />;
  }

  // todo: add more file extension

  return false;
};

S3FileItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default S3FileItem;
