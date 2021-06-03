import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import TextEditor from '../common/TextEditor';
import { DOCUMENT_ITEM_TEXT_EDITOR_ID } from '../../config/selectors';
import { getDocumentExtra } from '../../utils/itemExtra';

// eslint-disable-next-line no-unused-vars
const DocumentItem = ({ item }) => (
  <TextEditor
    id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
    readOnly
    value={getDocumentExtra(item.get('extra'))?.content}
  />
);

DocumentItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default DocumentItem;
