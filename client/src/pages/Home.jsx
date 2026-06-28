import { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskRow from '../components/TaskRow';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import Button from '../components/Button';
import SkeletonRow from '../components/SkeletonRow';
import DetailPanel from '../components/DetailPanel';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CalendarView from '../components/CalendarView';
import StickyWallView from '../components/StickyWallView';
import MetadataModal from '../components/MetadataModal';
import SettingsModal from '../components/SettingsModal';
import DashboardView from '../components/DashboardView';
import FilterBar from '../components/FilterBar';

const Home = () => {
  const { tasks, loading, error, loadTasks, filters, setFilters, metadata, addList, addTag } = useTaskContext();
  const { user, logout } = useAuth();

  const [activeView, setActiveView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);  // for edit modal
  const [detailTask, setDetailTask] = useState(null);  // right panel
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Metadata modal state
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [metadataModalType, setMetadataModalType] = useState('list'); // 'list' | 'tag'

  // Settings modal state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load on mount
  useEffect(() => { loadTasks({ timeframe: 'today' }); /* eslint-disable-next-line */ }, []);

  // Handle sidebar navigation
  const handleNavigate = (viewId) => {
    setActiveView(viewId);
    setDetailTask(null);
    let newFilters = { status: '', priority: '', list: '', tags: '', timeframe: '' };

    if (viewId === 'today' || viewId === 'upcoming') {
      newFilters.timeframe = viewId;
    } else if (viewId.startsWith('list:')) {
      newFilters.list = viewId.split(':')[1];
    } else if (viewId.startsWith('tag:')) {
      newFilters.tags = viewId.split(':')[1];
    }

    setFilters(newFilters);
    loadTasks(newFilters);
  };

  const openCreate = () => { setSelectedTask(null); setIsModalOpen(true); };
  const openEdit = (task) => { setSelectedTask(task); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedTask(null); };

  const openMetadataModal = (type) => {
    setMetadataModalType(type);
    setIsMetadataModalOpen(true);
  };
  const closeMetadataModal = () => setIsMetadataModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  // Calculate Title based on activeView
  let viewTitle = 'Tasks';
  if (activeView === 'dashboard') viewTitle = 'Dashboard';
  if (activeView === 'today') viewTitle = 'Today';
  if (activeView === 'upcoming') viewTitle = 'Upcoming';
  if (activeView === 'calendar') viewTitle = 'Calendar';
  if (activeView === 'sticky') viewTitle = 'Sticky Wall';
  if (activeView.startsWith('list:')) viewTitle = activeView.split(':')[1];
  if (activeView.startsWith('tag:')) viewTitle = `Tag: ${activeView.split(':')[1]}`;

  return (
    <div className="app-shell">

      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />

      <div className="workspace">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeView={activeView}
          onNavigate={handleNavigate}
          tasks={tasks}
          metadata={metadata}
          onLogout={logout}
          onAddClick={openCreate}
          onAddListClick={() => openMetadataModal('list')}
          onAddTagClick={() => openMetadataModal('tag')}
          onSettingsClick={openSettingsModal}
        />

        {/* ── Main Panel ──────────────────────────────────── */}
        <main className="main-panel">
          <div className="main-panel__header">
            <div>
              <h1 className="main-panel__title">{viewTitle}</h1>
              <p className="main-panel__sub">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {(activeView === 'today' || activeView === 'upcoming') && (
                <FilterBar compact />
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="state-error" role="alert">
              <p>⚠️ {error}</p>
              <Button variant="secondary" size="sm" onClick={() => loadTasks(filters)}>Retry</Button>
            </div>
          )}

          {/* Task list or Custom Views */}
          <div className="task-list-area">
            {activeView === 'dashboard' ? (
              <DashboardView user={user} onAddClick={openCreate} />
            ) : loading && !error ? (
              <>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</>
            ) : !loading && !error && tasks.length === 0 ? (
              <div className="state-empty">
                <div className="state-empty__icon">📋</div>
                <h2 className="state-empty__title">No tasks here</h2>
              </div>
            ) : activeView === 'calendar' ? (
              <CalendarView
                tasks={tasks}
                onDetail={(t) => setDetailTask(t)}
                activeId={detailTask?._id}
              />
            ) : activeView === 'sticky' ? (
              <StickyWallView
                tasks={tasks}
                onDetail={(t) => setDetailTask(t)}
                activeId={detailTask?._id}
              />
            ) : (
              <>
                {/* Active tasks */}
                {tasks.filter(t => t.status !== 'completed').length > 0 && (
                  <div className="task-section">
                    {tasks.filter(t => t.status !== 'completed').map(task => (
                      <TaskRow
                        key={task._id}
                        task={task}
                        onEdit={openEdit}
                        onDetail={() => setDetailTask(task)}
                        isActive={detailTask?._id === task._id}
                      />
                    ))}
                  </div>
                )}

                {/* Completed tasks — collapsible */}
                {tasks.filter(t => t.status === 'completed').length > 0 && (
                  <CompletedSection
                    tasks={tasks.filter(t => t.status === 'completed')}
                    onEdit={openEdit}
                    onDetail={(t) => setDetailTask(t)}
                    activeId={detailTask?._id}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* ── Detail Panel ────────────────────────────────── */}
        {detailTask && (
          <DetailPanel
            task={detailTask}
            onClose={() => setDetailTask(null)}
            onEdit={(task) => { openEdit(task); }}
            onUpdated={(updated) => setDetailTask(updated)}
          />
        )}
      </div>

      {/* ── FAB ─────────────────────────────────────────── */}
      <button type="button" className="fab" onClick={openCreate} aria-label="Add new task" title="Add new task">
        <span className="fab__icon">+</span>
      </button>

      {/* ── Create / Edit Modal ──────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        size="md"
      >
        <TaskForm task={selectedTask} onSuccess={closeModal} onCancel={closeModal} />
      </Modal>

      {/* ── Metadata Modal (Add Tag/List) ──────────────────────────── */}
      <MetadataModal
        isOpen={isMetadataModalOpen}
        onClose={closeMetadataModal}
        type={metadataModalType}
        onSubmit={metadataModalType === 'list' ? addList : addTag}
        metadata={metadata}
      />

      {/* ── Settings Modal ──────────────────────────── */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />
    </div>
  );
};

/* Collapsible completed section */
const CompletedSection = ({ tasks, onEdit, onDetail, activeId }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="completed-section">
      <button className="completed-toggle" onClick={() => setOpen(v => !v)}>
        <span className="completed-toggle__arrow">{open ? '▾' : '▸'}</span>
        Completed · {tasks.length}
      </button>
      {open && tasks.map(task => (
        <TaskRow
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDetail={() => onDetail(task)}
          isActive={activeId === task._id}
        />
      ))}
    </div>
  );
};

export default Home;
