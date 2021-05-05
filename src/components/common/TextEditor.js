import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

// formula dependencies
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  TEXT_EDITOR_MIN_HEIGHT,
  TEXT_EDITOR_TOOLBAR,
} from '../../config/constants';

window.katex = katex;

const useStyles = makeStyles(() => ({
  wrapper: {
    '& .ql-editor': {
      minHeight: TEXT_EDITOR_MIN_HEIGHT,
    },
  },
}));

const TextEditor = ({ id, onChange, value, readOnly }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.wrapper}>
      <ReactQuill
        id={id}
        placeholder={!readOnly ? t('Write something') : ''}
        readOnly={readOnly}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: readOnly ? null : TEXT_EDITOR_TOOLBAR,
        }}
      />
    </div>
  );
};

TextEditor.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

TextEditor.defaultProps = {
  id: null,
  value: '',
  onChange: () => {},
  readOnly: false,
};

export default TextEditor;
