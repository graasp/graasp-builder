import React, { useEffect, useState } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { getFileContent } from '../../api/item';
import { MIME_TYPES } from '../../config/constants';

const FileItem = ({ item }) => {
  const [url, setUrl] = useState();
  const { mimetype } = item.get('extra');
  const id = item.get('id');
  const name = item.get('name');

  useEffect(() => {
    (async () => {
      const itemUrl = await getFileContent({ id, mimetype });
      setUrl(itemUrl);

      return () => {
        URL.revokeObjectURL(url);
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mimetype, item]);

  if (!url) {
    return null;
  }

  if (MIME_TYPES.IMAGE.includes(mimetype)) {
    return <img src={url} alt={name} />;
  }

  if (MIME_TYPES.VIDEO.includes(mimetype)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls>
        <source src={url} type={mimetype} />
      </video>
    );
  }

  // todo: add more file extension

  return false;
};

FileItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default FileItem;
