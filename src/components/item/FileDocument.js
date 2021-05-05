import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FileDocument = () => {
  const [value, setValue] = useState('hello');

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default FileDocument;
