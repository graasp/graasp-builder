import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import { SHOW_NOTIFICATIONS } from '../config/constants';
import item from './item';
import layout from './layout';

const reducers = {
  item,
  layout,
};

if (SHOW_NOTIFICATIONS) {
  reducers.toastr = toastr;
}

export default combineReducers(reducers);
