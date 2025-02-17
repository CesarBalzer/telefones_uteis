import createReducerFor from '../store/createReducer';

const initial_state = {
  user: null,
};

const [UserReducer, actions] = createReducerFor('USER', initial_state);

export const setUser = actions.setUser;

export default UserReducer;
