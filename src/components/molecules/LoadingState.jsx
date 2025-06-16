import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name="RefreshCw" className="w-6 h-6 text-white" />
      </motion.div>
      
      <h3 className="text-lg font-semibold font-display text-gray-900 mb-2">
        Loading TaskFlow
      </h3>
      
      <p className="text-gray-500">
        Getting your tasks ready...
      </p>
    </div>
  )
}

export default LoadingState