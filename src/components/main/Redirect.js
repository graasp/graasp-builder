import React from 'react';
import { useHistory } from 'react-router';
import { HOME_PATH } from '../../config/paths';

const Redirect = () => {
  const { push } = useHistory();

  push(localStorage.getItem('redirectUrl') ?? HOME_PATH);

  return <></>;
};

export default Redirect;
