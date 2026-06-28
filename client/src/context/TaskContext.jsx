import { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskReducer, { initialState, ACTION_TYPES } from './taskReducer';
import * as api from '../api/taskApi';

// ── Context creation ────────────────────────────────────────────────────────
const TaskContext = createContext(null);

// ── Provider ────────────────────────────────────────────────────────────────
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadMetadata = useCallback(async () => {
    try {
      const res = await api.fetchMetadata();
      dispatch({ type: ACTION_TYPES.FETCH_METADATA_SUCCESS, payload: res.data });
    } catch (err) {
      console.error('Failed to load metadata', err);
    }
  }, []);

  /**
   * Load all tasks — applies current filter/sort state from the reducer.
   * useCallback ensures the function reference is stable (safe to use in useEffect deps).
   */
  const loadTasks = useCallback(async (overrideFilters = {}) => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    try {
      const params = { ...state.filters, ...overrideFilters };
      // Strip empty strings so they don't appear as query params
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await api.fetchTasks(params);
      dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: res.data });
      loadMetadata();
    } catch (err) {
      dispatch({ type: ACTION_TYPES.FETCH_ERROR, payload: err.message });
      toast.error(err.message);
    }
  }, [state.filters, loadMetadata]);

  /** Create a new task — optimistic add, then confirm with server data */
  const addTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      dispatch({ type: ACTION_TYPES.ADD_TASK, payload: res.data });
      loadMetadata();
      toast.success('Task created! 🎉');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  };

  /** Update existing task */
  const editTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: res.data });
      loadMetadata();
      toast.success('Task updated ✏️');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  };

  /** Delete a task */
  const removeTask = async (id) => {
    try {
      await api.deleteTask(id);
      dispatch({ type: ACTION_TYPES.DELETE_TASK, payload: id });
      loadMetadata();
      toast.success('Task deleted 🗑️');
    } catch (err) {
      toast.error(err.message);
    }
  };

  /** Clear all completed tasks */
  const clearCompletedTasks = async () => {
    try {
      await api.clearCompletedTasks();
      loadTasks(); // Reload to refresh list
      toast.success('Completed tasks cleared');
    } catch (err) {
      toast.error(err.message);
    }
  };

  /** Add Custom List */
  const addList = async (listName) => {
    try {
      await api.addCustomList(listName);
      loadMetadata();
      toast.success('List added');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  /** Add Custom Tag */
  const addTag = async (tagName) => {
    try {
      await api.addCustomTag(tagName);
      loadMetadata();
      toast.success('Tag added');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  /** Update filter/sort state and re-fetch */
  const setFilters = (newFilters) => {
    dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: newFilters });
  };

  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    metadata: state.metadata,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    clearCompletedTasks,
    setFilters,
    addList,
    addTag,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Custom hook — components import this instead of useContext(TaskContext) directly.
 * Throws a helpful error if used outside the provider.
 */
export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within a <TaskProvider>');
  return ctx;
};
