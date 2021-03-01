import React, { useEffect, useState } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { getFileContent } from '../../api/item';
import { MIME_TYPES } from '../../config/constants';
import FileImage from './FileImage';
import FileVideo from './FileVideo';

const FileItem = ({ item }) => {
  const [url, setUrl] = useState();
  const { mimetype } = item.get('extra');
  const id = item.get('id');
  const name = item.get('name');

  useEffect(() => {
    (async () => {
      const content = await getFileContent({ id });

      // Build a URL from the file
      const fileURL = URL.createObjectURL(await content.blob());
      setUrl(fileURL);

      return () => {
        URL.revokeObjectURL(url);
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!url) {
    return null;
  }

  if (MIME_TYPES.IMAGE.includes(mimetype)) {
    return <FileImage url={url} alt={name} />;
  }

  if (MIME_TYPES.VIDEO.includes(mimetype)) {
    return <FileVideo url={url} type={mimetype} />;
  }

  // todo: add more file extension

  return false;
};

FileItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default FileItem;
