import React, { useEffect, useState } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { getS3FileUrl } from '../../api/item';
import { MIME_TYPES } from '../../config/constants';
import FileImage from './FileImage';
import FileVideo from './FileVideo';
import FilePdf from './FilePdf';
import { getS3FileExtra } from '../../utils/itemExtra';

const S3FileItem = ({ item }) => {
  const [url, setUrl] = useState();
  const { contenttype } = getS3FileExtra(item.get('extra'));
  const id = item.get('id');
  const name = item.get('name');

  useEffect(() => {
    (async () => {
      const itemUrl = await getS3FileUrl({ id });

      const content = await fetch(itemUrl);

      // Build a URL from the file
      const fileURL = URL.createObjectURL(await content.blob());
      setUrl(fileURL);

      return () => {
        URL.revokeObjectURL(url);
      };
    })();
    // does not include url to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!url) {
    return null;
  }

  if (MIME_TYPES.IMAGE.includes(contenttype)) {
    return <FileImage id={id} url={url} alt={name} />;
  }

  if (MIME_TYPES.VIDEO.includes(contenttype)) {
    return <FileVideo id={id} url={url} type={contenttype} />;
  }

  if (MIME_TYPES.PDF.includes(contenttype)) {
    return <FilePdf id={id} url={url} />;
  }

  // todo: add more file extension

  return false;
};

S3FileItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default S3FileItem;
