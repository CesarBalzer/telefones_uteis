import { createStore } from 'redux';
import rootReducer from './reducers';
import Reactotron from '../../ReactotronConfig';

export default createStore(rootReducer, Reactotron.createEnhancer());
