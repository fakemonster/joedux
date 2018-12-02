module.exports = {
  combineReducers(shape) {
    return (state = {}, action) => {
      const newState = {};
      let stateHasBeenModified = false;

      Object.entries(shape).forEach(([slice, reducer]) => {
        newState[slice] = reducer(state[slice], action);
        if (newState[slice] !== state[slice]) stateHasBeenModified = true;
      });

      return stateHasBeenModified ? newState : state;
    };
  },

  createStore(reducer) {
    let state = reducer(undefined, { type: 'YOU_BETTER_NOT_USE_THIS_ONE' });
    let subscribers = [];

    return {
      dispatch(action) {
        state = reducer(state, action);
        subscribers.forEach(f => f());
      },

      getState() {
        return state;
      },

      subscribe(listener) {
        subscribers.push(listener);
        return () => {
          subscribers = subscribers.filter(f => f !== listener);
        };
      },
    };
  },
};
