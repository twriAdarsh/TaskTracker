/**
 * Task Reducer
 *
 * Pure function — takes current state + action, returns next state.
 * Keeping this in its own file keeps TaskContext.jsx clean.
 */

export const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
  metadata: {
    lists: [],
    tags: [],
  },
};

export const ACTION_TYPES = {
  // Async lifecycle
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  FETCH_METADATA_SUCCESS: 'FETCH_METADATA_SUCCESS',

  // CRUD mutations — optimistic updates happen here
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',

  // Filter/sort
  SET_FILTERS: 'SET_FILTERS',

  // Clear error
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return { ...state, loading: true, error: null };

    case ACTION_TYPES.FETCH_SUCCESS:
      return { ...state, loading: false, tasks: action.payload };

    case ACTION_TYPES.FETCH_METADATA_SUCCESS:
      return { ...state, metadata: action.payload };

    case ACTION_TYPES.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTION_TYPES.ADD_TASK:
      // Prepend so the new task appears at the top of the list immediately
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case ACTION_TYPES.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };

    case ACTION_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };

    case ACTION_TYPES.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default taskReducer;
