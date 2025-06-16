import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Button from '@/components/atoms/Button'

const Header = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  showArchived,
  onToggleArchived,
  onAddTask
}) => {
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">Organize your day efficiently</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search tasks..."
          />
          
          <FilterDropdown
            options={priorityOptions}
            value={selectedPriority}
            onChange={onPriorityChange}
            placeholder="Priority"
            icon="Filter"
          />
          
          <FilterDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={onStatusChange}
            placeholder="Status"
            icon="CheckCircle"
          />

          <Button
            variant={showArchived ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onToggleArchived(!showArchived)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Archive" className="w-4 h-4" />
            <span>{showArchived ? 'Active' : 'Archived'}</span>
          </Button>

          <Button
            variant="primary"
            onClick={onAddTask}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header