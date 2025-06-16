import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ hasFilters, onAddTask }) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Search" className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-2">
            No tasks found
          </h3>
          
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckSquare" className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">
          Ready to get organized?
        </h3>
        
        <p className="text-gray-500 mb-8">
          Create your first task and start building productive habits. Every journey begins with a single step!
        </p>
        
        <Button
          variant="primary"
          size="lg"
          onClick={onAddTask}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Create Your First Task</span>
        </Button>
      </motion.div>
    </div>
  )
}

export default EmptyState