import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import { SHOW_NOTIFICATIONS } from '../config/constants';
import item from './item';
import member from './member';

const reducers = {
  item,
  member,
};

if (SHOW_NOTIFICATIONS) {
  reducers.toastr = toastr;
}

export default combineReducers(reducers);
