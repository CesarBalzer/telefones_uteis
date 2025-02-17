const createReducer = (prefix, initialState) => {
  let methods = {};
  let actions = {};

  for (let attribute in initialState) {
    let typeDecorator = `${prefix}_SET_${attribute.toUpperCase()}`;
    let actionDecorator = `set${capitalize(attribute)}`;

    methods[typeDecorator] = (state, action) => {
      return { ...state, [attribute]: action.payload };
    };

    methods[`${prefix}_RESET`] = () => {
      return { ...initialState };
    };

    actions[actionDecorator] = (value) => {
      return { type: typeDecorator, payload: value };
    };

    actions['reset'] = () => {
      return { type: `${prefix}_RESET` };
    };
  }

  const reducer = (state = initialState, action) => {
    if (typeof methods[action.type] === 'function') {
      return methods[action.type](state, action);
    }
    return state;
  };

  return [reducer, actions];
};

export function capitalize(str) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export default createReducer;
