import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onArchive,
  showArchived 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    if (task.completed) {
      onToggleComplete(task.Id, false)
      return
    }

    setIsCompleting(true)
    setTimeout(() => {
      onToggleComplete(task.Id, true)
      setIsCompleting(false)
    }, 300)
  }

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'High': return 'task-priority-high'
      case 'Medium': return 'task-priority-medium'
      case 'Low': return 'task-priority-low'
      default: return 'task-priority-low'
    }
  }

  const getCategoryClass = () => {
    return `category-${task.category.toLowerCase()}`
  }

  const formatDueDate = () => {
    const dueDate = new Date(task.dueDate)
    
    if (isToday(dueDate)) return 'Today'
    if (isTomorrow(dueDate)) return 'Tomorrow'
    return format(dueDate, 'MMM dd')
  }

  const getDueDateColor = () => {
    const dueDate = new Date(task.dueDate)
    
    if (isPast(dueDate) && !task.completed) return 'text-error'
    if (isToday(dueDate)) return 'text-warning'
    return 'text-gray-500'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={`bg-surface rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-lg ${getPriorityClass()} ${
        task.completed ? 'opacity-60' : ''
      } ${isCompleting ? 'animate-task-complete' : ''}`}
    >
      <div className="flex items-start space-x-4">
        <motion.button
          whileScale={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <ApperIcon name="Check" className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-gray-900 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            
            {!showArchived && (
              <div className="flex items-center space-x-1 ml-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onArchive(task.Id)}
                  className="p-1.5 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="Archive" className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(task.Id)}
                  className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
          
          {task.description && (
            <p className={`text-sm text-gray-600 mb-3 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getCategoryClass()}`}>
                {task.category}
              </span>
              
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                task.priority === 'High' 
                  ? 'bg-error/10 text-error'
                  : task.priority === 'Medium'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {task.priority}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
              <span className={getDueDateColor()}>
                {formatDueDate()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard