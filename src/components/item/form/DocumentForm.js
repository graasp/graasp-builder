import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { TextEditor } from '@graasp/ui';
import { buildDocumentExtra, getDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  textEditorWrapper: {
    marginTop: theme.spacing(2),
  },
}));

const DocumentForm = ({ onChange, item, updatedProperties }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleOnChange = (content) => {
    onChange({
      ...updatedProperties,
      extra: buildDocumentExtra({ content }),
    });
  };

  const value =
    getDocumentExtra(updatedProperties?.extra)?.content ||
    getDocumentExtra(item?.extra)?.content;

  return (
    <>
      <BaseForm
        onChange={onChange}
        item={item}
        updatedProperties={updatedProperties}
      />
      <div className={classes.textEditorWrapper}>
        <TextEditor
          id={ITEM_FORM_DOCUMENT_TEXT_ID}
          value={value}
          onChange={handleOnChange}
          edit
          placeholderText={t('Write something...')}
        />
      </div>
    </>
  );
};

DocumentForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    extra: PropTypes.shape({}),
  }).isRequired,
  updatedProperties: PropTypes.shape({
    extra: PropTypes.shape({}),
  }).isRequired,
};

export default DocumentForm;
