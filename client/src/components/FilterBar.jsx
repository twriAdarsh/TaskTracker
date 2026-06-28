import { useTaskContext } from '../context/TaskContext';

/**
 * FilterBar — supports `compact` prop for topbar inline mode.
 */
const FilterBar = ({ compact = false }) => {
  const { filters, setFilters, loadTasks } = useTaskContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    loadTasks(updatedFilters);
  };

  const clearFilters = () => {
    const reset = { status: '', priority: '', sortBy: 'createdAt', order: 'desc' };
    setFilters(reset);
    loadTasks(reset);
  };

  const hasActiveFilters = filters.status || filters.priority ||
    filters.sortBy !== 'createdAt' || filters.order !== 'desc';

  return (
    <div className={`filter-bar ${compact ? 'filter-bar--compact' : ''}`}>
      <div className="filter-bar__controls">

        {/* Status filter */}
        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">Status</label>
          <select
            id="filter-status"
            name="status"
            className="filter-select"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority filter */}
        <div className="filter-group">
          <label htmlFor="filter-priority" className="filter-label">Priority</label>
          <select
            id="filter-priority"
            name="priority"
            className="filter-select"
            value={filters.priority}
            onChange={handleChange}
          >
            <option value="">All Priorities</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="filter-group">
          <label htmlFor="filter-sortBy" className="filter-label">Sort By</label>
          <select
            id="filter-sortBy"
            name="sortBy"
            className="filter-select"
            value={filters.sortBy}
            onChange={handleChange}
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        {/* Order */}
        <div className="filter-group">
          <label htmlFor="filter-order" className="filter-label">Order</label>
          <select
            id="filter-order"
            name="order"
            className="filter-select"
            value={filters.order}
            onChange={handleChange}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button className="filter-clear" onClick={clearFilters} aria-label="Clear all filters">
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
