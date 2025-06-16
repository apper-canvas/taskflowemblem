import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask, 
  onArchiveTask,
  showArchived 
}) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks at bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Sort by priority
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 }
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    
    // Sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-display text-gray-900">
            {showArchived ? 'Archived Tasks' : 'Your Tasks'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {showArchived ? 'archived' : 'total'}
          </p>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedTasks.map((task) => (
              <motion.div
                key={task.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onArchive={onArchiveTask}
                  showArchived={showArchived}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default TaskList