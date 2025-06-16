import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategorySidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  const totalTasks = categories.reduce((sum, cat) => sum + cat.taskCount, 0)

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Work': 'Briefcase',
      'Personal': 'User',
      'Urgent': 'AlertTriangle',
      'Health': 'Heart',
      'Finance': 'DollarSign'
    }
    return icons[categoryName] || 'Tag'
  }

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-surface border-r border-gray-200 p-6 overflow-y-auto"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">Categories</h2>
          
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange('all')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name="Grid3x3" className="w-5 h-5" />
                <span className="font-medium">All Tasks</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {totalTasks}
              </span>
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category.Id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
onClick={() => onCategoryChange(category.Name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
selectedCategory === category.Name
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
<ApperIcon name={getCategoryIcon(category.Name)} className="w-5 h-5" />
                  <span className="font-medium">{category.Name}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
selectedCategory === category.Name
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
{category.task_count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="gradient-primary rounded-lg p-4 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="Target" className="w-6 h-6" />
              <h3 className="font-semibold">Daily Goal</h3>
            </div>
            <p className="text-sm text-white/80">
              Complete at least 3 tasks today to stay productive!
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

export default CategorySidebar