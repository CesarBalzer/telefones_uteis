import { combineReducers } from 'redux';
import UserReducer from '../reducers/UserReducer';

const rootReducer = combineReducers({
  user: UserReducer,
});

export default rootReducer;
